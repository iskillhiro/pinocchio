import React, { useEffect, useState } from 'react'
import { animated } from 'react-spring'

const images = [
	'/Manual/1.svg',
	'/Manual/2.svg',
	'/Manual/3.svg',
	'/Manual/4.svg',
	'/Manual/5.svg',
	'/Manual/6.svg',
	'/Manual/7.svg',
	'/Manual/8.svg',
]

const Manual = () => {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isPaused, setIsPaused] = useState(false)

	const handleClick = e => {
		const clickX = e.clientX
		const windowWidth = window.innerWidth

		if (clickX < windowWidth / 2) {
			setCurrentIndex(
				prevIndex => (prevIndex - 1 + images.length) % images.length
			)
		} else {
			setCurrentIndex(prevIndex => (prevIndex + 1) % images.length)
		}
	}

	useEffect(() => {
		if (!isPaused) {
			const interval = setInterval(() => {
				setCurrentIndex(prevIndex => (prevIndex + 1) % images.length)
			}, 3000)

			return () => clearInterval(interval)
		}
	}, [isPaused])

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
					boxShadow: 'inset 0 0 80px rgba(0, 0, 0, 0.8)',
					overflow: 'hidden',
					transition: 'background-image 0.5s ease-in-out', // Добавьте плавный переход для backgroundImage
				}}
			/>

			{progressBar()}
		</div>
	)
}

export default Manual
