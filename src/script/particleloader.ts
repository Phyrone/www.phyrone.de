import 'particles.js/particles'
// @ts-ignore
import particlesConfig from './particlesjs-config.json'
import  '../styles/particles.sass'

export default function loadParticles() {

    console.log(`config: ${particlesConfig}`)
    let pariclesScreen = document.createElement("div")
    pariclesScreen.id = 'pariclesScreen'

    document.getElementsByTagName("body")[0].appendChild(pariclesScreen)

    // @ts-ignore
    window.particlesJS.load(pariclesScreen.id, particlesConfig, () => {

    })
}