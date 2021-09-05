import * as THREE from 'three'

import Experience from './Experience.js'
import vertexShader from './shaders/baked/vertex.glsl'
import fragmentShader from './shaders/baked/fragment.glsl'

export default class CoffeeSteam
{
    constructor()
    {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.time = this.experience.time

        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'baked',
                expanded: true
            })
        }

        this.setModel()
    }

    setModel()
    {
        this.model = {}
        
        this.model.mesh = this.resources.items.roomModel.scene.children[0]

        this.model.bakedTexture = this.resources.items.bakedTexture
        this.model.bakedTexture.encoding = THREE.sRGBEncoding
        this.model.bakedTexture.flipY = false

        this.model.lightMapTexture = this.resources.items.lightMapTexture
        this.model.lightMapTexture.flipY = false

        this.colors = {}
        this.colors.tv = '#de11ff'
        this.colors.desk = '#ff7c00'
        this.colors.pc = '#4cbdff'

        this.model.material = new THREE.ShaderMaterial({
            uniforms:
            {
                uBakedTexture: { value: this.model.bakedTexture },
                uLightMapTexture: { value: this.model.lightMapTexture },

                uLightTvColor: { value: new THREE.Color(this.colors.tv) },
                uLightTvStrength: { value: 1.47 },

                uLightDeskColor: { value: new THREE.Color(this.colors.desk) },
                uLightDeskStrength: { value: 1.86 },

                uLightPcColor: { value: new THREE.Color(this.colors.pc) },
                uLightPcStrength: { value: 1.27 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        })

        this.model.mesh.traverse((_child) =>
        {
            if(_child instanceof THREE.Mesh)
            {
                _child.material = this.model.material
            }
        })

        this.scene.add(this.model.mesh)
        
        // Debug
        if(this.debug)
        {
            this.debugFolder
                .addInput(
                    this.colors,
                    'tv',
                    { view: 'color' }
                )
                .on('change', () =>
                {
                    this.model.material.uniforms.uLightTvColor.value.set(this.colors.tv)
                })

            this.debugFolder
                .addInput(
                    this.model.material.uniforms.uLightTvStrength,
                    'value',
                    { label: 'uLightTvStrength', min: 0, max: 3 }
                )

            this.debugFolder
                .addInput(
                    this.colors,
                    'desk',
                    { view: 'color' }
                )
                .on('change', () =>
                {
                    this.model.material.uniforms.uLightDeskColor.value.set(this.colors.desk)
                })

            this.debugFolder
                .addInput(
                    this.model.material.uniforms.uLightDeskStrength,
                    'value',
                    { label: 'uLightDeskStrength', min: 0, max: 3 }
                )

            this.debugFolder
                .addInput(
                    this.colors,
                    'pc',
                    { view: 'color' }
                )
                .on('change', () =>
                {
                    this.model.material.uniforms.uLightPcColor.value.set(this.colors.pc)
                })

            this.debugFolder
                .addInput(
                    this.model.material.uniforms.uLightPcStrength,
                    'value',
                    { label: 'uLightPcStrength', min: 0, max: 3 }
                )
        }
    }
}