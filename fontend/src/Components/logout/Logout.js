import { BaseURL } from '../Url/BaseURL'
import Button from '@material-ui/core/Button';
import axios from 'axios'
import {useHistory} from 'react-router-dom'


function Logout() {

    const history = useHistory()

    const LogoutRequest = () => {
        axios({
            method: 'post',
            url: BaseURL + '/logout',
            withCredentials: true
        }).then((response) => {
            if (response.status === 200) {
                history.push('/login');
            }
        }).catch((error) => {
            console.log(error.data.message);
        });
    }


    return   <Button onClick={LogoutRequest} type="submit" > Logout </Button>

}


export default Logout;