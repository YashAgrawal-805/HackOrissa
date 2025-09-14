import open from 'open';
import robot from 'robotjs';

const sendMessage = async (phoneNumber, message) => {
  try {
    
    await open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`);

    
    setTimeout(() => {
      robot.keyTap('tab'); 

     
      setTimeout(() => {
        robot.typeString(message);

        setTimeout(() => {
          robot.keyTap('enter');
          console.log('Message sent!');
        }, 1000);
      }, 1000);
    }, 10000);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
// Example usage
export default sendMessage;
