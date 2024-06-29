const Popup = ({ handlePopupClose, popupInfo, buttonText }) => {
	return (
		<div className='popup-overlay' onClick={handlePopupClose}>
			<div className='popup block'>
				<div id='boost-info'>
					<div className='popup-icon'>
						<img src={popupInfo.iconSrc} alt='boost icon' />
					</div>
					<h3 className='popup-title'>{popupInfo.title}</h3>
				</div>
				<button className='gradient-btn'>{buttonText}</button>
			</div>
		</div>
	)
}

export default Popup
