import '../styles.css'
const Notification = ({ text, error }) => {
  return (
    <div>
      {text && <div className='message'>{text}</div>}
      {error && <div className='error message'>{error}</div>}
    </div>
  )
}

export default Notification
