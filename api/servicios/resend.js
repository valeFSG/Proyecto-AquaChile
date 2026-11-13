import { Resend } from 'resend'
import 'dotenv/config'

// Remitente de pruebas de Resend. En producción iría el dominio de la empresa.
const REMITENTE = 'Psicolaboral AquaChile <onboarding@resend.dev>'

let cliente = null

export function correoActivo() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CORREO_RECLUTAMIENTO)
}

function conectar() {
  if (!cliente) cliente = new Resend(process.env.RESEND_API_KEY)
  return cliente
}

async function enviar({ para, asunto, html }) {
  const { error } = await conectar().emails.send({
    from: REMITENTE,
    to: para,
    subject: asunto,
    html,
  })

  if (error) throw new Error(error.message)
}

const marco = (titulo, cuerpo) => `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#1c2430;max-width:520px;line-height:1.5">
    <h2 style="color:#0e7490;font-size:18px;margin:0 0 14px">${titulo}</h2>
    ${cuerpo}
    <p style="color:#8a93a0;font-size:11px;border-top:1px solid #e3e7ec;padding-top:10px;margin-top:24px">
      Mensaje automático del sistema de evaluaciones psicolaborales.
      Proyecto académico Duoc UC · DSY1104. Por favor no responder.
    </p>
  </div>
`

export async function avisarCandidato(solicitud) {
  const nombre = solicitud.candidato?.nombre ?? ''

  await enviar({
    para: solicitud.candidato?.correo,
    asunto: `Recibimos tu postulación a ${solicitud.cargo}`,
    html: marco('Tu postulación quedó registrada', `
      <p>Hola ${nombre},</p>
      <p>Recibimos tu postulación al cargo de <strong>${solicitud.cargo}</strong>.
      Tu evaluación psicolaboral quedó registrada y el área de Reclutamiento y
      Selección se pondrá en contacto para coordinar la entrevista.</p>
      <p>No necesitas hacer nada por ahora.</p>
    `),
  })
}

export async function avisarReclutamiento(solicitud) {
  const nombre = solicitud.candidato?.nombre ?? ''
  const tipo = solicitud.candidato?.tipo ?? ''

  await enviar({
    para: process.env.CORREO_RECLUTAMIENTO,
    asunto: `Nueva solicitud de evaluación: ${nombre}`,
    html: marco('Ingresó una solicitud nueva', `
      <p><strong>${nombre}</strong> · ${tipo}</p>
      <p>
        Cargo: ${solicitud.cargo}<br>
        Familia: ${solicitud.familiaCargo}<br>
        Solicitada por: ${solicitud.analista}
      </p>
      ${solicitud.carpetaUrl
        ? `<p><a href="${solicitud.carpetaUrl}" style="color:#0e7490">Abrir la carpeta en Drive</a></p>`
        : ''}
    `),
  })
}