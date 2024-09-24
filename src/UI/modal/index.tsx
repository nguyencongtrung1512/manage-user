import "./index.scss";

function Modal({ isOpen = false, onCancel, onOk }) {
    return (
        <div className={`modal ${isOpen ? "active" : ""}`}>
            <div className="modal__overlay" onClick={onCancel}></div>
            <div className="modal__content">
                <button className="modal__cancel" onClick={onCancel}>Cancel</button>
                <button className="modal__ok" onClick={onOk}>OK</button>
            </div>
        </div>
    );
}

export default Modal;
