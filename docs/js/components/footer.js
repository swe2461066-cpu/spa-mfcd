import { t } from "../i18n/i18n.js";

// 2.13.4 — Сайтын доод хэсэг: хамтрагч байгууллагууд, төслийн баг, холбоо барих.
const PARTNERS = [
  { icon: "afaci.png", key: "afaci", href: "https://rda.go.kr/afaci/site/project/view?pageId=02020401&pageName=APPT#submenu02020401" },
  { icon: "muls.png", key: "muls", href: "https://muls.edu.mn" },
  { icon: "rda.png", key: "rda", href: "https://www.rda.go.kr/foreign/ten2/" },
  { icon: "mfali.png", key: "mfali", href: "https://www.mofa.gov.mn" },
];

const TEAM = [
  { icon: "fa-user-tie", key: "projectInvestigators" },
  { icon: "fa-flask", key: "researchers" },
  { icon: "fa-users", key: "others" },
  { icon: "fa-laptop-code", key: "softwareDeveloper" },
];

// Миний өөрчлөлт: номд inline style-тай давтагдсан <li>-уудыг массиваас үүсгэдэг болгосон.
export function renderFooter() {
  return `
    <footer class="footer app-footer">
      <div class="container">
        <div class="columns is-multiline is-centered">
          <div class="column is-12-mobile is-6-tablet is-4-desktop">
            <div class="content">
              <h3 class="title is-5">${t("footer.teamMembers")}</h3>
              <ul>
                ${PARTNERS.map(
                  (p) => `
                  <li>
                    <img src="./img/icon/${p.icon}" alt="${p.key.toUpperCase()}">
                    <a class="custom-link" href="${p.href}" target="_blank" rel="noopener noreferrer">${t(`footer.${p.key}`)}</a>
                  </li>`,
                ).join("")}
              </ul>
            </div>
          </div>

          <div class="column is-12-mobile is-6-tablet is-4-desktop">
            <div class="content">
              <h3 class="title is-5">${t("footer.coreMembers")}</h3>
              <ul>
                ${TEAM.map((m) => `<li><i class="fas ${m.icon} fa-fw"></i> ${t(`footer.${m.key}`)}</li>`).join("")}
              </ul>
            </div>
          </div>

          <div class="column is-12-mobile is-6-tablet is-4-desktop">
            <div class="content">
              <h3 class="title is-5">${t("footer.contactInformation")}</h3>
              <ul>
                <li><i class="fas fa-university fa-fw"></i> ${t("footer.university")}</li>
                <li><i class="fas fa-map-marker-alt fa-fw"></i> ${t("footer.address")}</li>
                <li><i class="fas fa-phone fa-fw"></i> ${t("footer.phone")}: (+976)-89075531</li>
                <li><i class="fas fa-envelope fa-fw"></i> ${t("footer.email")}: <a class="custom-link" href="mailto:orgilid@muls.edu.mn">orgilid@muls.edu.mn</a></li>
              </ul>
            </div>
          </div>
        </div>
        <p class="app-footer-note">© ${new Date().getFullYear()} ${t("footer.labNote")}</p>
      </div>
    </footer>
  `;
}

export function mountFooter(root) {
  if (!root) return;
  root.innerHTML = renderFooter();
}
