import {Component} from "react";
import axios from "axios";

class Home extends Component {
    async componentDidMount() {
        await axios.get("http://localhost:8083/login/check").then((res, err) => {

        })
    }
}