import "./Legals.css";

const legalSections = [
    {
        title: "Protección de datos",
        summary: "Cumplimos RGPD y LOPDGDD para resguardar los datos energéticos y financieros.",
        items: [
            "Tus datos se alojan en servidores europeos con cifrado AES-256 en tránsito y reposo.",
            "Solo conservamos información estrictamente necesaria para simulaciones y reportes.",
            "Puedes solicitar exportación, rectificación o eliminación escribiendo a privacidad@energysim.io."
        ]
    },
    {
        title: "Uso aceptable de la plataforma",
        summary: "Orientamos el simulador a proyectos renovables transparentes y verificables.",
        items: [
            "Prohibimos la manipulación de datos para maquillar rendimientos o emisiones.",
            "Las credenciales son personales; implementar autenticación multifactor es obligatorio para admins.",
            "Auditamos accesos críticos y notificamos anomalías en menos de 24 horas."
        ]
    },
    {
        title: "Propiedad intelectual",
        summary: "El modelado energético, dashboards y APIs son propiedad de Renewable Energy Project.",
        items: [
            "Los usuarios conservan los derechos de los datasets que cargan, otorgando licencia de uso operativo.",
            "Cualquier reutilización externa requiere atribución visible y aprobación escrita.",
            "Las marcas y logotipos están protegidos por la OMPI y tratados bilaterales vigentes."
        ]
    },
    {
        title: "Transparencia financiera",
        summary: "Seguimos la taxonomía europea de finanzas sostenibles y estándares IFRS-S2.",
        items: [
            "Emitimos reportes trimestrales con desglose de emisiones evitadas y ahorros estimados.",
            "Las pasarelas de pago están certificadas PCI DSS nivel 1 y tokenizamos la información sensible.",
            "Ofrecemos contratos con cláusulas ESG personalizadas para grandes desarrolladores."
        ]
    }
];

const complianceTimeline = [
    {
        year: "2022",
        label: "Auditoría RGPD",
        detail: "Superamos la revisión de la Agencia Española de Protección de Datos sin observaciones críticas.",
        status: "completado"
    },
    {
        year: "2023",
        label: "ISO 14064-1",
        detail: "Certificamos nuestra metodología de cálculo de emisiones para proyectos fotovoltaicos e híbridos.",
        status: "vigente"
    },
    {
        year: "2024",
        label: "Informe ESG",
        detail: "Publicamos métricas de impacto alineadas con GRI 302 y 305 para los 50 clientes principales.",
        status: "publicado"
    },
    {
        year: "2025",
        label: "Ley europea de IA",
        detail: "Actualizamos los modelos predictivos con explicabilidad obligatoria y registro de datasets.",
        status: "en curso"
    }
];

const contactChannels = [
    { label: "Privacidad", value: "privacidad@energysim.io" },
    { label: "Contrataciones", value: "+34 XXX XX XX XX" },
    { label: "Canal ético", value: "whistleblower.energy/report" }
];

function Legals() {
    return (
        <main className="legals-page">
            <section className="legals-hero">
                <p className="legals-eyebrow">Actualizado el 8 de diciembre de 2025</p>
                <h1>Marco legal y compromiso ético</h1>
                <p className="legals-lede">
                    Nuestra plataforma conecta datos energéticos sensibles con decisiones de inversión. Por eso
                    reforzamos la trazabilidad jurídica, la protección de datos y la transparencia climática en cada
                    interacción.
                </p>
                <div className="legals-badges">
                    <span>ISO 14064-1</span>
                    <span>RGPD Ready</span>
                    <span>IFRS-S2</span>
                </div>
            </section>

            <section className="legals-grid">
                {legalSections.map((section) => (
                    <article key={section.title} className="legal-card">
                        <h2>{section.title}</h2>
                        <p>{section.summary}</p>
                        <ul>
                            {section.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </section>

            <section className="legals-compliance">
                <div className="timeline">
                    <h3>Hoja de ruta de cumplimiento</h3>
                    <div className="timeline-track">
                        {complianceTimeline.map((event) => (
                            <div key={event.year} className="timeline-step">
                                <p className="timeline-year">{event.year}</p>
                                <p className="timeline-label">{event.label}</p>
                                <p className="timeline-detail">{event.detail}</p>
                                <span className="timeline-status">{event.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <aside className="contact-card">
                    <h3>Necesitas documentación oficial?</h3>
                    <p>
                        Solicita contratos, anexos técnicos o informes ESG dedicados. Respondemos en un máximo de 72
                        horas laborables.
                    </p>
                    <ul>
                        {contactChannels.map((channel) => (
                            <li key={channel.label}>
                                <span>{channel.label}</span>
                                <strong>{channel.value}</strong>
                            </li>
                        ))}
                    </ul>
                </aside>
            </section>
        </main>
    );
}

export default Legals;