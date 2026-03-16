import type { Identifier } from "../common";
import type { Receiver, ReceiverEditState, ReceiverPayload } from "../domain/receiver";

export interface FormReceiverProps {
  receiverToEdit?: ReceiverEditState | null;
  onSave: (receiver: ReceiverPayload) => void;
  onCancel: () => void;
}

export interface ReceiverCardProps {
  receiver: Receiver;
  onEdit: (receiver: Receiver) => void;
  onDelete: (id?: Identifier | null) => void;
}
