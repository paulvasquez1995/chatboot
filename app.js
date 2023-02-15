const { createBot, createProvider, createFlow, addKeyword, addAnswer } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const VenomProvider = require('@bot-whatsapp/provider/venom')
const MockAdapter = require('@bot-whatsapp/database/mock')

/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */


const flowSecundario = addKeyword(['siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowPlanes = addKeyword(['1','promociones', 'planes', 'internet', 'plan', 'promocion'])
.addAnswer('📄 Te muestro nuestros planes de Internet por Fibra Óptica',{
            media:'https://scontent.fuio11-1.fna.fbcdn.net/v/t39.30808-6/314083655_500145722160770_607061987993767243_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=gyTwe6qtfPUAX-kAIlX&_nc_ht=scontent.fuio11-1.fna&oh=00_AfAB8BHLt74CzJa8gHBp6tMmzl7kw9mwhpv9Nt1Qm4mYNw&oe=63F148CD' 
        },    
    [flowSecundario]
)
        .addAnswer( 'Adicional te comento que tenemos una *PROMOCIÓN* de instalacion gratuita a partir del Plan Medium ($19.99) o si gustas un plan menor tenemos una promocion del 50% de descuento en el valor de instalacion, que de $70 terminas cancelando $35 y a eso se suma el mes actual de consumo gratis')

const flowSoporte = addKeyword(['soporte', '2', 'tecnico']).addAnswer(
    [
        '🙌 Bienvenido, me puedes ayudar revisando si tu modem se encuentra encendido y tiene un foco de color *rojo* titilando',
        'Si es asi por favor envia *rojo*',
        'Si no es asi por favor digita *otro*',
    ],
    null,
    null,
    [flowSecundario]
)

const flowPagos = addKeyword(['3', 'pagos', 'pagar']).addAnswer(
    [
        '🚀 Bienvenido, para registrar tu pago por favor ayudanos con:',
        'La foto o captura del comprobante de *deposito* o *transferencia*',
        'Tus dos *nombres* y dos *apellidos* para el registro del pago',
        ' Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowDiscord = addKeyword(['discord']).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD'],
    null,
    null,
    [flowSecundario]
)

const flowPrincipal = addKeyword(['hola', 'ole', 'alo','buenas', 'buenos'])
    .addAnswer('🙌 Hola te saludamos del Servicio de Internet Fibra Optica *Smartlinks*')
    .addAnswer(
        [
            'En que podemos ayudarte',
            'Responde con el *número* segun tu interes:',
            '👉 *1* para *Promociones y planes* para ver la documentacion',
            '👉 *2* para *Soporte Técnico*  para informar alguna anomalia en el servicio',
            '👉 *3* para *Registro de pagos* registra tu pago del servicio',
        ],
        null,
        null,
        [flowPlanes, flowPagos, flowSoporte, flowDiscord]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowPlanes, flowPagos,flowSoporte])
    const adapterProvider = createProvider(VenomProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()
