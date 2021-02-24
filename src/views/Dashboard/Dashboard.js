import React from "react";
import { withTranslation, Trans } from "react-i18next";

function Dashboard(props) {
  const { t } = props;
  return (
    <div>
        <Trans>
           <p>{t("description")}</p>
           <p>{t("users")}</p>
        </Trans>
    </div>
  );
}

export default (withTranslation("translations")(Dashboard));
