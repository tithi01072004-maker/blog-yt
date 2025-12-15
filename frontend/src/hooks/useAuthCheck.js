import axios from "axios";
import { setUser } from "../redux/authSlice";
import { useDispatch } from "react-redux";

export const useAuthCheck = () => {
    const dispatch = useDispatch();

    const checkAuth = async () => {
        try {
            const res = await axios.get(
                "/api/v1/user/me",
                { withCredentials: true }
            );

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                return true;   // logged in
            }
        } catch (error) {
            dispatch(setUser(null));
            return false;      // logged out
        }
    };

    return { checkAuth };
};
