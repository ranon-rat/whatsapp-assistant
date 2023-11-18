import { search, login, table } from "./parts"
import { Params } from "./types"


export default function Home(req: Params) {
    const token = req.searchParams.token
    if (token !== process.env.VERIFY_TOKEN) {
        return <div>
            {login()}
        </div>

    }
    return <div>
        <div>
            {search(req.searchParams.token!)}
        </div>
        <div>
            {table(req.searchParams.search!)}
        </div>
    </div>

}