import React, { useEffect, useState } from 'react'
import { animated, useSpring } from 'react-spring'

const images = [
	'https://avatars.mds.yandex.net/i?id=0a8dc1da8b47ac63e1b06dadc55e1a3f_l-5141109-images-thumbs&n=27&h=480&w=480',
	'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxR9HDlnMcTgDlh-WyL8lmU5BCRl7cJaVZvw&s',
	'https://masterpiecer-images.s3.yandex.net/0e40edb447e111ee9bda5a1112d6d6c5:upscaled',
]

const Manual = () => {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isPaused, setIsPaused] = useState(false)

	const [{ x }, api] = useSpring(() => ({ x: 0 }))

	const handleClick = e => {
		const clickX = e.clientX
		const windowWidth = window.innerWidth

		if (clickX < windowWidth / 2) {
			setCurrentIndex((currentIndex - 1 + images.length) % images.length)
		} else {
			setCurrentIndex((currentIndex + 1) % images.length)
		}
		api.start({ x: 0 }) // Reset x position for smooth transition
	}

	const progressBar = () => {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					position: 'absolute',
					bottom: '20px',
					width: '100%',
				}}
			>
				{images.map((_, index) => (
					<div
						key={index}
						style={{
							width: '12px',
							height: '12px',
							borderRadius: '50%',
							backgroundColor: index === currentIndex ? 'gold' : '#444',
							margin: '0 5px',
							transition: 'background-color 0.3s',
						}}
					/>
				))}
			</div>
		)
	}

	useEffect(() => {
		if (!isPaused) {
			const interval = setInterval(() => {
				setCurrentIndex((currentIndex + 1) % images.length)
			}, 3000)

			return () => clearInterval(interval)
		}
	}, [currentIndex, isPaused])

	return (
		<div
			style={{
				width: '100%',
				height: '100vh',
				position: 'relative',
				overflow: 'hidden',
				backgroundColor: '#000',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
			onClick={handleClick}
		>
			<animated.div
				style={{
					width: '100%',
					height: '100%',
					backgroundImage: `url(${images[currentIndex]})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					cursor: 'pointer',
					position: 'absolute',
					transition: 'transform 0.5s ease-in-out',
					boxShadow: 'inset 0 0 80px rgba(0, 0, 0, 0.8)',
					overflow: 'hidden',
				}}
			/>

			{progressBar()}
		</div>
	)
}

export default Manual
