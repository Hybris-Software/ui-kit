import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useMemo,
  useContext,
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
 * @param {Object} props.body - Body
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
 * @param {function} props.onModalHide - On modal close
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
    overlayClassName = Style.overlay,
    modalStyle,
    modalClassName = Style.modal,
    closeIconStyle,
    closeIconClassName = Style.hideModal,
    closeIcon = (
      <span className={Style.hideButton}>
        <AiOutlineClose />
      </span>
    ),
    showCloseIcon = true,
    destroyBodyOnClose = true,
    onModalOpen = () => {},
    onModalHide = () => {},
    onBodyUpdate = () => {},
    onModalDestroy = () => {},
    onCloseIconClick = () => {},
  },
  ref
) => {
  // Contexts
  const themeContext = useContext(ThemeContext);

  // States
  const [hide, setHide] = useState(true);
  const [destroy, setDestroy] = useState(true);
  const [computedBody, setComputedBody] = useState(body);
  const [computedOptions, setComputedOptions] = useState({});

  // Refs
  const defaultRef = useRef(null);
  const modalRef = ref || defaultRef;

  // Computed options
  const computedModalOptions = useMemo(
    () => ({
      // Styles
      computedContentStyle: computedOptions?.contentStyle || contentStyle,
      computedOverlayStyle: computedOptions?.overlayStyle || overlayStyle,
      computedModalStyle: computedOptions?.modalStyle || modalStyle,
      computedCloseIconStyle: computedOptions?.closeIconStyle || closeIconStyle,

      // Classes
      computedContentClassName:
        computedOptions?.contentClassName ||
        (themeContext.theme &&
          themeContext.theme?.magicModal &&
          themeContext.theme?.magicModal?.contentClassName) ||
        contentClassName,
      computedOverlayClassName:
        computedOptions?.overlayClassName ||
        (themeContext.theme &&
          themeContext.theme?.magicModal &&
          themeContext.theme?.magicModal?.overlayClassName) ||
        overlayClassName,
      computedModalClassName:
        computedOptions?.modalClassName ||
        (themeContext.theme &&
          themeContext.theme?.magicModal &&
          themeContext.theme?.magicModal?.modalClassName) ||
        modalClassName,
      computedCloseIconClassName:
        computedOptions?.closeIconClassName ||
        (themeContext.theme &&
          themeContext.theme?.magicModal &&
          themeContext.theme?.magicModal?.closeIconClassName) ||
        closeIconClassName,

      // Events
      computedOnModalHide: computedOptions?.onModalHide || onModalHide,
      computedOnModalOpen: computedOptions?.onModalOpen || onModalOpen,
      computedOnBodyUpdate: computedOptions?.onBodyUpdate || onBodyUpdate,
      computedOnModalDestroy: computedOptions?.onModalDestroy || onModalDestroy,
      computedOnCloseIconClick:
        computedOptions?.onCloseIconClick || onCloseIconClick,

      // Other
      computedCloseIcon: computedOptions?.closeIcon || closeIcon,
      computedShowCloseIcon:
        computedOptions?.showCloseIcon !== undefined
          ? computedOptions?.showCloseIcon
          : showCloseIcon,
      computedDestroyBodyOnClose:
        computedOptions?.destroyBodyOnClose !== undefined
          ? computedOptions?.destroyBodyOnClose
          : destroyBodyOnClose,
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
      onModalHide,
      onBodyUpdate,
      onModalDestroy,
      onCloseIconClick,
      computedOptions,
    ]
  );

  // Methods
  useImperativeHandle(
    modalRef,
    () => {
      return {
        open() {
          setDestroy(false);
          setHide(false);
          computedModalOptions.computedOnModalOpen();
        },
        hide() {
          setHide(true);
          computedModalOptions.computedOnModalHide();
        },
        updateBody(body, options) {
          computedModalOptions.computedOnModalOpen();
          computedModalOptions.computedOnBodyUpdate();
          setDestroy(false);
          setHide(false);
          setComputedBody(body);
          setComputedOptions(options);
        },
        destroy() {
          setDestroy(true);
          setComputedBody(null);
          computedModalOptions.computedOnModalDestroy();
        },
        isOpen(){
          return !hide;
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      onModalHide,
      onModalOpen,
      onBodyUpdate,
      onModalDestroy,
      computedModalOptions,
    ]
  );

  return (
    !destroy && (
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
                    computedModalOptions.computedOnCloseIconClick();
                    computedModalOptions.computedOnModalHide();
                    if (computedModalOptions.computedDestroyBodyOnClose) {
                      modalRef.current.destroy();
                    } else {
                      modalRef.current.hide();
                    }
                  }}
                >
                  {computedModalOptions.computedCloseIcon}
                </span>
              </div>
            )}
            {computedBody}
          </div>
        </div>
      </div>
    )
  );
};

const MagicModal = forwardRef(ModalComponent);

export default MagicModal;
