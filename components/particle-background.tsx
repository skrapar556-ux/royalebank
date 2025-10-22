"use client"

import { useEffect, useRef } from "react"

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initParticles()
    }

    const cols = 80
    const rows = 50
    let particles: Array<{
      x: number
      y: number
      z: number
      baseX: number
      baseY: number
      size: number
      opacity: number
    }> = []

    const initParticles = () => {
      particles = []
      const spacingX = canvas.width / cols
      const spacingY = canvas.height / rows

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          particles.push({
            x: i * spacingX,
            y: j * spacingY,
            z: 0,
            baseX: i * spacingX,
            baseY: j * spacingY,
            size: 1,
            opacity: 0.8,
          })
        }
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let time = 0

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.04

      particles.forEach((particle) => {
        const normalizedX = particle.baseX / canvas.width
        const normalizedY = particle.baseY / canvas.height

        const wave1 =
          Math.sin(normalizedX * Math.PI * 3 + time * 2) * Math.cos(normalizedY * Math.PI * 2 + time * 1.5) * 50

        const wave2 =
          Math.sin(normalizedX * Math.PI * 2 - time * 1.5) * Math.cos(normalizedY * Math.PI * 3 - time * 1.2) * 35

        particle.z = wave1 + wave2

        const displacement = particle.z * 0.2
        particle.x = particle.baseX + Math.sin(time * 1.5 + normalizedY * Math.PI * 2) * displacement
        particle.y = particle.baseY + Math.cos(time * 1.5 + normalizedX * Math.PI * 2) * displacement

        const depthFactor = (particle.z + 100) / 200
        particle.size = 0.5 + depthFactor * 1.5
        particle.opacity = 0.2 + depthFactor * 0.4
      })

      ctx.strokeStyle = "rgba(220, 38, 38, 0.12)"
      ctx.lineWidth = 0.5

      for (let i = 0; i < cols - 1; i++) {
        for (let j = 0; j < rows - 1; j++) {
          const index = i * rows + j
          const rightIndex = (i + 1) * rows + j
          const downIndex = i * rows + (j + 1)

          if (rightIndex < particles.length) {
            ctx.beginPath()
            ctx.moveTo(particles[index].x, particles[index].y)
            ctx.lineTo(particles[rightIndex].x, particles[rightIndex].y)
            ctx.stroke()
          }

          if (downIndex < particles.length) {
            ctx.beginPath()
            ctx.moveTo(particles[index].x, particles[index].y)
            ctx.lineTo(particles[downIndex].x, particles[downIndex].y)
            ctx.stroke()
          }
        }
      }

      particles.forEach((particle) => {
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 3)

        gradient.addColorStop(0, `rgba(239, 68, 68, ${particle.opacity * 0.8})`)
        gradient.addColorStop(0.5, `rgba(220, 38, 38, ${particle.opacity * 0.4})`)
        gradient.addColorStop(1, "rgba(220, 38, 38, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ background: "#000" }} />
}
