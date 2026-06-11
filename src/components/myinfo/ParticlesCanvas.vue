<template>
        <!-- TODO:四季粒子效果实现 -->
        <canvas ref="canvasRef" class="particles-canvas"></canvas>
</template>
<script setup>
import { ref,onMounted, onUnmounted } from 'vue'

const prop = defineProps({
    particleColor: {
        type: String,
        default: '#fff', // spring, summer, autumn, winter
    },
    lineColor:{
        type: String,
        default: 'rgba(255,255,255,0)',
    }
})
// Canvas
const canvasRef = ref(null)
let ctx = null
const particles = []
const particleCount = 60
let w, h

// 粒子颜色（响应式）
// const particleColor = ref('#fff')
// const lineColor = ref('rgba(255,255,255,0)')

// 粒子类
class Particle {
    constructor() {
        this.x = Math.random() * w
        this.y = Math.random() * h
        this.size = Math.random() * 2 + 1
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
    }
    update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.x < 0) this.x = w
        if (this.x > w) this.x = 0
        if (this.y < 0) this.y = h
        if (this.y > h) this.y = 0
    }
    draw() {
        ctx.fillStyle = prop.particleColor
        ctx.globalAlpha = 0.5
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
    }
}

// 连线
function connect() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x
            const dy = particles[a].y - particles[b].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 120) {
                ctx.globalAlpha = 0.2
                ctx.strokeStyle = prop.lineColor
                ctx.lineWidth = 0.5
                ctx.beginPath()
                ctx.moveTo(particles[a].x, particles[a].y)
                ctx.lineTo(particles[b].x, particles[b].y)
                ctx.stroke()
            }
        }
    }
}

function init() {
    particles.length = 0
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
    }
}

function animate() {
    ctx.clearRect(0, 0, w, h)
    particles.forEach(p => {
        p.update()
        p.draw()
    })
    connect()
    requestAnimationFrame(animate)
}

onMounted(() => {
    const canvas = canvasRef.value
    ctx = canvas.getContext('2d')
    w = window.innerWidth
    h = window.innerHeight
    canvas.width = w
    canvas.height = h

    init()
    animate()
})
</script>

<style lang="scss" scoped>
.particles-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
}

</style>