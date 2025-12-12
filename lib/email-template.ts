export type TemplateData = {
  name: string;
  title: string;
  phoneNumber: string;
  email: string;
  meetingLink?: string;
};

export function generateEmailTemplate(data: TemplateData): string {
  // Hardcoded constants
  const linkedinUrl = 'https://www.linkedin.com/company/itf-llc-group/about/';
  const facebookUrl = 'https://www.facebook.com/itfgroup';
  const address = '11990 Missouri Bottom Road Hazelwood, MO 63042';
  const websiteUrl = 'http://itfgroup.com/';
  const websiteDisplay = 'www.itfgroup.com';
  const meetingUrl = data.meetingLink || 'https://meetings.hubspot.com/sam-burkhan';

  // Extract numbers only for the tel: link
  // Handles extension format like "123-456-7890 ext. 123" -> "tel:1234567890,,123"
  // Handles simple format like "123-456-7890" -> "tel:1234567890"
  let phoneHref = '';
  if (data.phoneNumber) {
    // Remove all non-digit and non-letter characters
    const cleanNumber = data.phoneNumber.replace(/[^\d+a-zA-Z]/g, '');
    
    // Check for extension indicators
    const extIndex = data.phoneNumber.toLowerCase().search(/(ext|x)\.?\s*/);
    
    if (extIndex !== -1) {
       // Split main number and extension
       const mainPart = data.phoneNumber.substring(0, extIndex).replace(/\D/g, '');
       const extPart = data.phoneNumber.substring(extIndex).replace(/\D/g, '');
       // Format for mobile dialing with pause (commas)
       phoneHref = `tel:+1${mainPart},,${extPart}`;
    } else {
       // Simple number cleaning
       const mainPart = data.phoneNumber.replace(/\D/g, '');
       phoneHref = `tel:+1${mainPart}`;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body
    style="font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif">
    <table
        style="width: 600px;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
        <tbody>
            <tr>
                <td
                    style="vertical-align: top; color: #0C1D32; font-size: 12px; line-height: 24px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; width: 40%; text-align: left;">
                    <table style="width: 100%;" cellpadding="0" cellspacing="0">

                        <tr>
                            <td>
                                <span style="font-weight: bold; color: #FF3000; font-size: 16px;">${data.name}</span>
                            </td>
                        </tr>

                        <tr style="vertical-align: top">
                            <td style="width: 10%; color: #0C1D32; ">
                                <span
                                    style="width: 10%; color: #0C1D32 ; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; ">${data.title}</span>
                            </td>

                        </tr>
                        <tr>
                            <td>
                                <table style="padding-top:18px" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding-right: 4px;width: 30px;height: 30px;">
                                            <a href="${linkedinUrl}"
                                                target="_blank" style="display: inline-block;height: 30px;">
                                                <img src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/linkedin.png"
                                                    width="32" height="32" style="border: 0; display: inline-block;"
                                                    alt="Linkedin">
                                            </a>
                                        </td>
                                        <td style="padding-right: 4px;width: 30px;height: 30px;">
                                            <a href="${facebookUrl}" target="_blank"
                                                style="display: inline-block;height: 30px;">
                                                <img src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/facebook.png"
                                                    width="32" height="32" style="border: 0; display: inline-block;"
                                                    alt="Facebook">
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                    </table>
                </td>

                <td style="
                color: #0C1D32;
                font-size: 12px;
                line-height: 20px;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                width: 40%;
                text-align: left;
                vertical-align: top;
                ">

                    <table cellpadding="0" cellspacing="0" style="width: 100%;">
                        <tr>
                            <td style="vertical-align: top; width: 16px; padding-right: 4px; padding-bottom: 6px;">
                                <img src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/call-white.png"
                                    alt="" style="width: 24px; display: block;" />
                            </td>
                            <td style="padding-bottom: 6px;">
                                <a href="${phoneHref}" style="color:#0C1D32;text-decoration:none"
                                    target="_blank">
                                    ${data.phoneNumber}
                                </a>
                            </td>
                        </tr>

                        <tr>
                            <td style="vertical-align: top; width: 16px; padding-right: 4px; padding-bottom: 6px;">
                                <img src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/location-white.png"
                                    alt="" style="width: 24px; display: block;" />
                            </td>
                            <td style="vertical-align: top;color: #0C1D32; text-decoration: none; padding-bottom: 6px;">
                                <span style="color:#0C1D32; text-decoration:none;">
                                    <a href="#"
                                        style="color:#0C1D32; text-decoration:none; pointer-events:none; cursor:default;">
                                        ${address}
                                    </a>
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td style="vertical-align: top; width: 16px; padding-right: 4px; padding-bottom: 6px;">
                                <img src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/web-white.png"
                                    alt="" style="width: 24px; display: block;padding-top: 2px;" />
                            </td>
                            <td style="padding-bottom: 6px;">
                                <a href="${websiteUrl}" style="color: #0C1D32; text-decoration: none;"
                                    target="_blank">
                                    ${websiteDisplay}
                                </a>
                            </td>
                        </tr>

                        <tr>
                            <td style="vertical-align: top; width: 16px; padding-right: 4px; padding-bottom: 6px;">
                                <img src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/email-white.png"
                                    alt="" style="width: 24px; display: block;padding-top: 1px;" />
                            </td>
                            <td style="padding-bottom: 6px;">
                                <a href="mailto:${data.email}" style="color: #0C1D32; text-decoration: none;"
                                    target="_blank">
                                    ${data.email}
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>

                <td style="vertical-align: top; text-align: right; width: 30%;">
                    <table cellpadding="0" cellspacing="0">
                        <tr>
                            <td>
                                <img style="height: 44px;"
                                    src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/itf-logo.png"
                                    alt="Logo" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <a
                                    href="https://www.carriersource.io/carriers/itf-group-llc?utm_campaign=itf-group-llc&utm_medium=email&utm_source=email_signature">
                                    <img style="height: 82px;"
                                        src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/CarrierSource_Rating_v2.png"
                                        alt="Logo" />
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>

            </tr>
            <tr>
                <td colspan="3" style="height: 32px;">
                    <p style="margin: 0.1px">
                        <a href="${meetingUrl}" style="
                            display: inline-block;
                            vertical-align: middle;
                        ">
                            <img src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/call_truck_banner.png"
                                alt="Footer Image" style="max-width: 102%; height: auto" class="CToWUd"
                                data-bit="iit" /></a>
                    </p>
                </td>
            </tr>

        </tbody>
    </table>
    <table
        style="width: 595px; border-collapse: collapse; background-image: url('https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/grey-main-bg.png'); margin: 0px 0px 0px 5px;">
        <tbody>
            <tr
                style="background-image: url('https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/grey-main-bg.png');">
                <td colspan="3"
                    style="padding: 0px 0; text-align: center;background-image: url('https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/grey-main-bg.png');">
                    <table cellpadding="0" cellspacing="0"
                        style="width: 100%; margin: 0 auto;background-image: url('https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/grey-main-bg.png');">
                        <tr>
                            <td style="padding: 0px;background-color: #F3F3F4; ">
                                <a href="https://itfgroup.com/solutions/forwarding" target="_blank">
                                    <img src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/Global_Forwarding.png"
                                        alt="Certification 1" style="max-width: 100%" />
                                </a>

                            </td>
                            <td style="padding: 0px;background-color: #F3F3F4; ">
                                <a href="https://itfgroup.com/solutions/logistics" target="_blank">
                                    <img src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/Logistics.png"
                                        alt="Certification 1" style="max-width: 100% " />

                                </a>

                            </td>
                            <td style="padding: 0px;background-color: #F3F3F4; ">
                                <a href="https://itfgroup.com/solutions/trucking" target="_blank">
                                    <img src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/Trucking.png"
                                        alt="Certification 1" style="max-width: 100%" />

                                </a>

                            </td>
                            <td style="padding: 0px;background-color: #F3F3F4; ">
                                <a href="https://itfgroup.com/" target="_blank">
                                    <img src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/ITF_logo_banner.png"
                                        alt="Certification 4" style="max-width: 100%" />
                                </a>

                            </td>
                            <td style="padding: 0px;background-color: #F3F3F4;">
                                <a href="https://itfgroup.com/solutions/tech" target="_blank">
                                    <img src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/Technology.png"
                                        alt="Certification 1" style="max-width: 100%" />

                                </a>

                            </td>
                            <td style="padding: 0px;background-color: #F3F3F4;">
                                <a href="https://itfgroup.com/solutions/d-f" target="_blank">
                                    <img src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/d_and_f.png"
                                        alt="Certification 1" style="max-width: 100%" />

                                </a>

                            </td>

                        </tr>
                    </table>
                </td>
            </tr>

            <tr>
                <td colspan="3"
                    style="height: 32px;margin-top: 100px;background-image: url('https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/grey-main-bg.png');">

                    <p style="margin: -2px">
                        <a style="
                            display: inline-block;
                            vertical-align: middle;
                        "><img src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/certi_rect_line.png"
                                alt="Footer Image" style="max-width: 100%; height: auto" class="CToWUd"
                                data-bit="iit" /></a>
                    </p>
                    <p style="margin: 0.1px">
                        <a style="
                            display: inline-block;
                            vertical-align: middle;
                        "><img src="https://prodwebsitesassets.blob.core.windows.net/email-assets/ITF/email_certification.gif"
                                alt="Footer Image" style="max-width: 100%; height: auto" class="CToWUd"
                                data-bit="iit" /></a>
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>`;
}
