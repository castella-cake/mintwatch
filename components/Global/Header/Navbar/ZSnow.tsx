interface SnowParticle {
    x: number
    y: number
    // 横方向の揺れの速度
    waveSpeed: number
    // 横方向の揺れの振幅
    waveAmplitude: number
    // 時間経過カウンター
    time: number
}

const SNOW_SIZE = 3 // 雪の粒の大きさ（一律）
const SNOW_COUNT = 80 // 雪の粒の数
const BASE_FALL_SPEED = 1.5 // 基本落下速度
const BASE_DRIFT_SPEED = 0.8 // 基本横流れ速度

export function ZSnowBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationFrameIdRef = useRef<number>(null!)
    const particlesRef = useRef<SnowParticle[]>([])

    // キャンバスのリサイズと雪の初期化
    const initializeSnow = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        // キャンバスサイズを親要素に合わせる
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        // 雪の粒を初期化
        particlesRef.current = Array.from({ length: SNOW_COUNT }, () => {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                waveSpeed: 0.02 + Math.random() * 0.03,
                waveAmplitude: Math.random() * 15,
                time: Math.random() * Math.PI * 2,
            }
        })
    }, [])

    const drawWithAnimationFrame = useCallback(() => {
        animationFrameIdRef.current = requestAnimationFrame(drawWithAnimationFrame)
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // 画面をクリア（透明）
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // 各雪の粒を更新・描画
        particlesRef.current.forEach((particle) => {
            // 描画
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, SNOW_SIZE, 0, Math.PI * 2)
            ctx.fill()

            // 位置更新
            particle.y += BASE_FALL_SPEED
            particle.x += BASE_DRIFT_SPEED

            // 三角関数を使った横揺れ
            particle.time += particle.waveSpeed
            particle.x += Math.sin(particle.time) * particle.waveAmplitude * 0.05

            // 画面外に出たら上に戻す
            if (particle.y > canvas.height + SNOW_SIZE || particle.x > canvas.width + SNOW_SIZE) {
                particle.y = -SNOW_SIZE
                particle.x = Math.random() * canvas.width - canvas.width * 0.2
                particle.time = Math.random() * Math.PI * 2
            }
        })
    }, [])

    useEffect(() => {
        initializeSnow()
        drawWithAnimationFrame()

        // リサイズ時の再初期化
        const handleResize = () => {
            initializeSnow()
        }
        window.addEventListener("resize", handleResize)

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current)
            }
            window.removeEventListener("resize", handleResize)
        }
    }, [initializeSnow, drawWithAnimationFrame])

    return (
        <canvas ref={canvasRef} className="zsnow-canvas" />
    )
}
