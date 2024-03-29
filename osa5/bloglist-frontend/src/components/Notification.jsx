import '../styles.css'
const Notification = ({ text, error }) => {
  return (
    <div>
      {error && <div className='error message'>{error}</div>}
      {text && <div className='message'>{text}</div>}
    </div>
  )
}

export default Notification
