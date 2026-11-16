// Bulma notification ашиглан анхааруулах/мэдээллийн мессеж харуулна.
export function renderNotification(message, type = "warning") {
  return `
    <div class="notification is-light is-${type}">
      ${message}
    </div>
  `;
}
