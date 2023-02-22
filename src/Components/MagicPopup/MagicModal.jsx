import {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useMemo,
} from "react";

// Icons
import { AiOutlineClose } from "react-icons/ai";

// Utils
import classNames from "../../Utils/classNames";

// Styles
import Style from "./MagicModal.module.css";

// Contexts
import ThemeContext from "../../Contexts/ThemeContext";

/**
 * @param {Object} props - props
 * @param {Object} props.body -
 * @param {Object} props.contentStyle - Style for the content
 * @param {string} props.contentClassName - Class name for the content
 * @param {Object} props.overlayStyle - Style for the overlay
 * @param {string} props.overlayClassName - Class name for the overlay
 * @param {Object} props.modalStyle - Style for the modal
 * @param {string} props.modalClassName - Class name for the modal
 * @param {Object} props.closeIconStyle - Style for the close icon
 * @param {string} props.closeIconClassName - Class name for the close icon
 * @param {JSX.Element} props.closeIcon - Close icon
 * @param {boolean} props.showCloseIcon - Show close icon
 * @param {boolean} props.destroyBodyOnClose - Destroy body on close
 * @param {function} props.onModalOpen - On modal open
 * @param {function} props.onModalClose - On modal close
 * @param {function} props.onBodyUpdate - On body update
 * @param {function} props.onModalDestroy - On modal destroy
 * @param {function} props.onCloseIconClick - On close icon click
 */

const ModalComponent = (
  {
    body,
    contentStyle,
    contentClassName = Style.content,
    overlayStyle,
    overlayClassName,
    modalStyle,
    modalClassName = Style.modal,
    closeIconStyle,
    closeIconClassName = Style.hideModal,
    closeIcon = <AiOutlineClose />,
    showCloseIcon = true,
    destroyBodyOnClose = true,
    onModalOpen = () => {},
    onModalClose = () => {},
    onBodyUpdate = () => {},
    onModalDestroy = () => {},
    onCloseIconClick = () => {},
  },
  ref
) => {
  // Contexts
  const themeContext = useContext(ThemeContext);

  // States
  const [open, setOpen] = useState(false);
  const [hide, setHide] = useState(!destroyBodyOnClose);
  const [destroy, setDestroy] = useState(false);
  const [computedBody, setComputedBody] = useState(body);

  // Refs
  const defaultRef = useRef(null);
  const modalRef = ref || defaultRef;

  // Computed options
  const computedModalOptions = useMemo(
    () => ({
      // Styles
      computedContentStyle:
        computedBody.modalOptions.contentStyle || contentStyle,
      computedOverlayStyle:
        computedBody.modalOptions.overlayStyle || overlayStyle,
      computedModalStyle: computedBody.modalOptions.modalStyle || modalStyle,
      computedCloseIconStyle:
        computedBody.modalOptions.closeIconStyle || closeIconStyle,

      // Classes
      computedContentClassName:
        computedBody.modalOptions.contentClassName ||
        (themeContext.theme &&
          themeContext.theme.magicModal &&
          themeContext.theme.magicModal.contentClassName) ||
        contentClassName,
      computedOverlayClassName:
        computedBody.modalOptions.overlayClassName ||
        (themeContext.theme &&
          themeContext.theme.magicModal &&
          themeContext.theme.magicModal.overlayClassName) ||
        overlayClassName,
      computedModalClassName:
        computedBody.modalOptions.modalClassName ||
        (themeContext.theme &&
          themeContext.theme.magicModal &&
          themeContext.theme.magicModal.modalClassName) ||
        modalClassName,
      computedCloseIconClassName:
        computedBody.modalOptions.closeIconClassName ||
        (themeContext.theme &&
          themeContext.theme.magicModal &&
          themeContext.theme.magicModal.closeIconClassName) ||
        closeIconClassName,

      // Events
      computedOnModalClose:
        computedBody.modalOptions.onModalClose || onModalClose,
      computedOnModalOpen: computedBody.modalOptions.onModalOpen || onModalOpen,
      computedOnBodyUpdate:
        computedBody.modalOptions.onBodyUpdate || onBodyUpdate,
      computedOnModalDestroy:
        computedBody.modalOptions.onModalDestroy || onModalDestroy,
      computedOnCloseIconClick:
        computedBody.modalOptions.onCloseIconClick || onCloseIconClick,

      // Other
      computedCloseIcon: computedBody.modalOptions.closeIcon || closeIcon,
      computedShowCloseIcon:
        computedBody.modalOptions.showCloseIcon || showCloseIcon,
      computedDestroyBodyOnClose:
        computedBody.modalOptions.destroyBodyOnClose || destroyBodyOnClose,
    }),
    [
      contentStyle,
      contentClassName,
      overlayStyle,
      overlayClassName,
      modalStyle,
      modalClassName,
      closeIconStyle,
      closeIconClassName,
      closeIcon,
      showCloseIcon,
      destroyBodyOnClose,
      onModalOpen,
      onModalClose,
      onBodyUpdate,
      onModalDestroy,
      onCloseIconClick,
      computedBody,
    ]
  );

  // Methods
  useImperativeHandle(
    modalRef,
    () => {
      return {
        open() {
          setDestroy(false);
          if (!destroyBodyOnClose) {
            setHide(false);
          } else {
            setOpen(true);
          }
          computedModalOptions.computedOnModalOpen();
        },
        close() {
          if (!destroyBodyOnClose) {
            setHide(true);
          } else {
            setOpen(false);
          }
          computedModalOptions.computedOnModalClose();
        },
        toggle() {
          setOpen(!open);
          if (open) {
            computedModalOptions.computedOnModalClose();
          } else {
            setDestroy(false);
            computedModalOptions.computedOnModalOpen();
          }
        },
        updateBody(child) {
          setDestroy(false);
          if (!destroyBodyOnClose) {
            setHide(false);
          } else {
            setOpen(true);
          }
          setComputedBody(child.body);
          computedModalOptions.computedOnBodyUpdate();
          computedModalOptions.computedOnModalOpen();
        },
        destroy() {
          setDestroy(true);
          if (!destroyBodyOnClose) {
            setHide(true);
          } else {
            setOpen(false);
          }
          computedModalOptions.computedOnModalDestroy();
        },
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onModalClose, onModalOpen, onBodyUpdate, onModalDestroy]
  );

  return (
    !destroy &&
    (open || !computedModalOptions.computedDestroyBodyOnClose ? (
      <div
        className={classNames(
          Style.window,
          computedModalOptions.computedOverlayClassName
        )}
        style={{
          ...computedModalOptions.computedOverlayStyle,
          display: hide ? "none" : "block",
        }}
      >
        <div
          className={classNames(
            computedModalOptions.computedModalClassName,
            Style.modalWindow
          )}
          style={computedModalOptions.computedModalStyle}
        >
          <div
            className={classNames(
              Style.content,
              computedModalOptions.computedContentClassName
            )}
            style={computedModalOptions.computedContentStyle}
          >
            {computedModalOptions.computedShowCloseIcon && (
              <div
                style={computedModalOptions.computedCloseIconStyle}
                className={computedModalOptions.computedCloseIconClassName}
              >
                <span
                  onClick={() => {
                    modalRef.current.close();
                    computedModalOptions.computedOnCloseIconClick();
                  }}
                >
                  {computedModalOptions.computedCloseIcon}
                </span>
              </div>
            )}
            {computedBody.body}
          </div>
        </div>
      </div>
    ) : null)
  );
};

const MagicModal = forwardRef(ModalComponent);

export default MagicModal;
