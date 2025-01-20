import { createRef, type Ref } from "preact";

interface ModalProps {
  modalRef: Ref<HTMLDialogElement>;
}

export default function Modal({ modalRef }: ModalProps) {
  function closeModal() {
    setTimeout(() => {
      modalRef.current?.close();
    }, 0);
  }
  return (
    <dialog ref={modalRef} id="modal" class="modal">
      <div className="modal-box">
        <h2 class="card-title">Liberar Pieza</h2>
        <p>Indica si la pieza fue aceptada o rechazada.</p>
        <div class="card-actions justify-end">
          <button onClick={accept} class="btn btn-primary">
            Aceptar
          </button>
          <button class="btn btn-ghost">Rechazar</button>
        </div>
      </div>
    </dialog>
  );
}
