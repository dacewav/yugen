export function orderConfirmationTemplate(params: {
  clientName: string;
  serviceName: string;
  orderId: string;
  portalUrl: string;
  deadline: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #030305; color: #B5B0A8; font-family: 'Space Grotesk', sans-serif;
           font-size: 15px; line-height: 1.8; margin: 0; padding: 0; }
    .wrap { max-width: 560px; margin: 0 auto; padding: 48px 32px; }
    .logo { color: #E8E6E1; font-size: 22px; letter-spacing: 8px; margin-bottom: 40px; }
    h2 { color: #E8E6E1; font-size: 20px; font-weight: 600; margin-bottom: 8px; }
    .divider { border: none; border-top: 1px solid rgba(255,255,255,0.04);
               margin: 32px 0; }
    .cta { display: inline-block; padding: 14px 32px;
           background: rgba(57,255,20,0.08); border: 1px solid rgba(57,255,20,0.3);
           color: #39FF14; text-decoration: none; letter-spacing: 2px;
           font-size: 12px; text-transform: uppercase; margin-top: 24px; }
    .mono { font-family: 'JetBrains Mono', monospace; font-size: 12px;
            color: #6A6560; }
    footer { margin-top: 48px; font-size: 12px; color: #3A3530; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo">YUGEN</div>
    <h2>Orden confirmada.</h2>
    <p>Hola ${params.clientName}, recibimos tu orden de <strong style="color:#E8E6E1">${params.serviceName}</strong>.</p>
    <p>Usa tu portal privado para subir tus stems y seguir el progreso:</p>
    <a href="${params.portalUrl}" class="cta">→ ABRIR PORTAL</a>
    <hr class="divider">
    <p class="mono">ID: ${params.orderId}</p>
    <p class="mono">Entrega estimada: ${params.deadline}</p>
    <footer>YUGEN · Puebla, México</footer>
  </div>
</body>
</html>
  `.trim();
}

export function paymentReceivedTemplate(params: {
  clientName: string;
  orderId: string;
  amount: string;
  currency: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #030305; color: #B5B0A8; font-family: 'Space Grotesk', sans-serif;
           font-size: 15px; line-height: 1.8; margin: 0; padding: 0; }
    .wrap { max-width: 560px; margin: 0 auto; padding: 48px 32px; }
    .logo { color: #E8E6E1; font-size: 22px; letter-spacing: 8px; margin-bottom: 40px; }
    h2 { color: #E8E6E1; font-size: 20px; font-weight: 600; margin-bottom: 8px; }
    .amount { font-family: 'JetBrains Mono', monospace; font-size: 28px;
              color: #39FF14; margin: 24px 0; }
    .mono { font-family: 'JetBrains Mono', monospace; font-size: 12px;
            color: #6A6560; }
    footer { margin-top: 48px; font-size: 12px; color: #3A3530; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo">YUGEN</div>
    <h2>Pago recibido.</h2>
    <p>Hola ${params.clientName}, confirmamos tu pago.</p>
    <div class="amount">${params.amount} ${params.currency}</div>
    <p class="mono">Orden: ${params.orderId}</p>
    <footer>YUGEN · Puebla, México</footer>
  </div>
</body>
</html>
  `.trim();
}

export function orderCompleteTemplate(params: {
  clientName: string;
  serviceName: string;
  orderId: string;
  portalUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #030305; color: #B5B0A8; font-family: 'Space Grotesk', sans-serif;
           font-size: 15px; line-height: 1.8; margin: 0; padding: 0; }
    .wrap { max-width: 560px; margin: 0 auto; padding: 48px 32px; }
    .logo { color: #E8E6E1; font-size: 22px; letter-spacing: 8px; margin-bottom: 40px; }
    h2 { color: #E8E6E1; font-size: 20px; font-weight: 600; margin-bottom: 8px; }
    .cta { display: inline-block; padding: 14px 32px;
           background: rgba(0,240,255,0.08); border: 1px solid rgba(0,240,255,0.3);
           color: #00F0FF; text-decoration: none; letter-spacing: 2px;
           font-size: 12px; text-transform: uppercase; margin-top: 24px; }
    footer { margin-top: 48px; font-size: 12px; color: #3A3530; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo">YUGEN</div>
    <h2>¡Tu ${params.serviceName} está lista!</h2>
    <p>Hola ${params.clientName}, tu orden fue completada. Descarga tus archivos desde el portal:</p>
    <a href="${params.portalUrl}" class="cta">→ DESCARGAR</a>
    <footer>YUGEN · Puebla, México</footer>
  </div>
</body>
</html>
  `.trim();
}
