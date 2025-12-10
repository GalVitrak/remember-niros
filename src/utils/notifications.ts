import { message, Modal } from "antd";

export const showSuccess = (content: string) => {
  message.success(content);
};

export const showError = (content: string) => {
  message.error(content);
};

export const showWarning = (content: string) => {
  message.warning(content);
};

export const showInfo = (content: string) => {
  message.info(content);
};

export const confirmAction = (
  title: string,
  content: string,
  onOk: () => void | Promise<void>,
  onCancel?: () => void
): void => {
  Modal.confirm({
    title,
    content,
    okText: "אישור",
    cancelText: "ביטול",
    onOk,
    onCancel,
    centered: true,
    okButtonProps: {
      danger: false,
    },
  });
};

export const confirmDanger = (
  title: string,
  content: string,
  onOk: () => void | Promise<void>,
  onCancel?: () => void
): void => {
  Modal.confirm({
    title,
    content,
    okText: "אישור",
    cancelText: "ביטול",
    onOk,
    onCancel,
    centered: true,
    okButtonProps: {
      danger: true,
    },
  });
};

