const palette = [
	"#C5E7FF",
	"#FFE4C4",
	"#E6E9FF",
	"#DCFCE7",
	"#FFF3C4"
];

const generateNodeId = () => `node-${Math.random().toString(36).slice(2, 9)}`;
const generateConnectionId = () => `conn-${Math.random().toString(36).slice(2, 9)}`;

const roundCoord = (value) => Math.round((Number(value) || 0) * 100) / 100;

const resolveElementIdFromApiNode = (node = {}) => (
	node?.element?.id ??
	node?.elementIdReference ??
	node?.elementId ??
	node?.element_id ??
	null
);

const resolveElementIdFromUiNode = (node = {}) => (
	node?.elementId ??
	node?.meta?.id ??
	node?.meta?.elementId ??
	node?.meta?.element_id ??
	null
);

const buildNodeSignature = (elementId, positionX, positionY) => {
	if (!elementId) {
		return null;
	}
	return [
		elementId,
		roundCoord(positionX),
		roundCoord(positionY)
	].join(":");
};

const attachBackendIdentifiers = (uiNodes, apiNodes = []) => {
	if (!apiNodes.length) {
		return uiNodes;
	}

	const buckets = new Map();
	apiNodes.forEach((apiNode) => {
		const signature = buildNodeSignature(
			resolveElementIdFromApiNode(apiNode),
			apiNode.positionX ?? 0,
			apiNode.positionY ?? 0
		);
		if (!signature || !apiNode.id) {
			return;
		}
		const entries = buckets.get(signature) ?? [];
		entries.push(apiNode.id);
		buckets.set(signature, entries);
	});

	return uiNodes.map((node) => {
		const elementId = resolveElementIdFromUiNode(node);
		const signature = buildNodeSignature(
			elementId,
			node.position.x,
			node.position.y
		);
		if (!signature) {
			return node;
		}
		const entries = buckets.get(signature);
		if (!entries || entries.length === 0) {
			return node;
		}
		const backendId = entries.shift();
		if (!backendId || backendId === node.backendId) {
			return node;
		}
		return { ...node, backendId };
	});
};

const serializeDiagram = (nodes, connections) => JSON.stringify({
	nodes: nodes.map((node) => ({
		backendId: node.backendId ?? null,
		elementId: resolveElementIdFromUiNode(node),
		positionX: roundCoord(node.position.x),
		positionY: roundCoord(node.position.y)
	})),
	connections: connections.map((connection) => ({
		backendId: connection.backendId ?? null,
		source: connection.source,
		target: connection.target,
		connectionType: connection.connectionType ?? ""
	}))
});

const normalizeProject = (project) => {
	const apiNodes = project?.projectNodes ?? [];
	const uiNodes = apiNodes.map((node, index) => {
		const uiId = node.id ? `node-${node.id}` : generateNodeId();
		const elementId = resolveElementIdFromApiNode(node);
		return {
			id: uiId,
			backendId: node.id ?? null,
			elementId,
			label: node.element?.name ?? `Nodo ${index + 1}`,
			type: node.element?.elementType ?? "catálogo",
			wattage: node.element?.powerWatt ?? node.element?.powerConsumption ?? null,
			notes: "",
			color: palette[index % palette.length],
			position: {
				x: node.positionX ?? 200 + index * 30,
				y: node.positionY ?? 160 + index * 24
			},
			meta: node.element ?? (elementId ? { id: elementId } : {})
		};
	});

	const nodeMap = new Map();
	apiNodes.forEach((node, index) => {
		if (node.id) {
			nodeMap.set(node.id, uiNodes[index]?.id);
		}
	});

	const uiConnections = (project?.nodeConnections ?? [])
		.map((connection) => {
			const source = nodeMap.get(connection.source?.id);
			const target = nodeMap.get(connection.target?.id);
			if (!source || !target) {
				return null;
			}
			return {
				id: connection.id ? `conn-${connection.id}` : generateConnectionId(),
				backendId: connection.id ?? null,
				source,
				target,
				connectionType: connection.connectionType ?? "",
				label: connection.connectionType ?? ""
			};
		})
		.filter(Boolean);

	return { nodes: uiNodes, connections: uiConnections };
};

const buildProjectPayload = (project, nodes, connections) => {
	const persistableNodes = [];
	const uiToBackend = new Map();
	let skippedNodes = 0;

	nodes.forEach((node) => {
		const elementId = resolveElementIdFromUiNode(node);
		if (!elementId) {
			skippedNodes += 1;
			return;
		}
		const payloadNode = {
			id: node.backendId ?? null,
			element: { id: elementId },
			positionX: roundCoord(node.position.x),
			positionY: roundCoord(node.position.y)
		};
		persistableNodes.push(payloadNode);
		uiToBackend.set(node.id, node.backendId ?? null);
	});

	let skippedConnections = 0;
	const connectionPayloads = [];

	connections.forEach((connection) => {
		const sourceBackendId = uiToBackend.get(connection.source);
		const targetBackendId = uiToBackend.get(connection.target);
		if (!sourceBackendId || !targetBackendId) {
			skippedConnections += 1;
			return;
		}
		connectionPayloads.push({
			id: connection.backendId ?? null,
			connectionType: connection.connectionType ?? "",
			source: { id: sourceBackendId },
			target: { id: targetBackendId }
		});
	});

	const payload = {
		id: project.id,
		name: project.name,
		energyNeeded: project.energyNeeded,
		energyEnough: project.energyEnough,
		userId: project.userId,
		projectNodes: persistableNodes,
		nodeConnections: connectionPayloads
	};

	return { payload, skippedNodes, skippedConnections };
};

const buildElementDictionary = (elements = []) => {
	const catalog = new Map();
	elements.forEach((element) => {
		if (!element || element.id == null) {
			return;
		}
		catalog.set(element.id, element);
	});
	return catalog;
};

const buildElementMetadataCache = (nodes = []) => {
	const cache = new Map();
	nodes.forEach((node) => {
		const elementId = resolveElementIdFromUiNode(node);
		if (!elementId) {
			return;
		}
		cache.set(elementId, {
			label: node.label,
			type: node.type,
			wattage: node.wattage,
			notes: node.notes,
			color: node.color,
			meta: node.meta ?? {}
		});
	});
	return cache;
};

const hydrateNodesWithMetadata = (nodes = [], cache) => {
	if (!cache || typeof cache.get !== "function") {
		return nodes;
	}
	return nodes.map((node) => {
		const elementId = resolveElementIdFromUiNode(node);
		if (!elementId) {
			return node;
		}
		const metadata = cache.get(elementId);
		if (!metadata) {
			return node;
		}
		const hasMeta = node.meta && Object.keys(node.meta).length > 0;
		return {
			...node,
			label: metadata.label ?? node.label,
			type: metadata.type ?? node.type,
			wattage: metadata.wattage ?? node.wattage,
			notes: metadata.notes ?? node.notes,
			color: metadata.color ?? node.color,
			meta: hasMeta ? node.meta : metadata.meta ?? {}
		};
	});
};

const hydrateNodesFromCatalog = (nodes = [], catalog) => {
	if (!catalog || typeof catalog.get !== "function" || nodes.length === 0) {
		return nodes;
	}
	let mutated = false;
	const result = nodes.map((node) => {
		const elementId = resolveElementIdFromUiNode(node);
		if (!elementId) {
			return node;
		}
		const catalogEntry = catalog.get(elementId);
		if (!catalogEntry) {
			return node;
		}

		const nextNode = {
			...node,
			label: catalogEntry.name ?? node.label,
			type: catalogEntry.elementType ?? catalogEntry.category ?? node.type,
			wattage: catalogEntry.powerWatt ?? catalogEntry.powerConsumption ?? node.wattage,
			meta: catalogEntry
		};

		if (
			nextNode.label === node.label &&
			nextNode.type === node.type &&
			nextNode.wattage === node.wattage &&
			nextNode.meta === node.meta
		) {
			return node;
		}

		mutated = true;
		return nextNode;
	});

	return mutated ? result : nodes;
};

export {
	palette,
	generateNodeId,
	generateConnectionId,
	roundCoord,
	buildNodeSignature,
	attachBackendIdentifiers,
	serializeDiagram,
	normalizeProject,
	buildProjectPayload,
	buildElementDictionary,
	buildElementMetadataCache,
	hydrateNodesWithMetadata,
	hydrateNodesFromCatalog
};
