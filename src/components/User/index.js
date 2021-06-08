import { useParams } from 'react-router-dom'
import UserInfo from './UserInfo'
import Pwd from './Pwd'

export default function User () {
    return (<>
        {
            useParams().pageName === "myUserInfo" ? <UserInfo /> : <Pwd />

        }
    </>)
}
