
export const whatsappContactWidgetQuery = `
  *[_type == "whatsappContactWidget"][0] {
    phoneNumber,
    message,
    title,
    subtitle,
    buttonText,

  }`