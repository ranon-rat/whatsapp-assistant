import { GetArchives } from "../database"
import { archiveProfile } from "../types"
import { Fragment } from "react"
export function login() {
    return <div id="login" className="centered">
        <div
            className="centered block max-w-sm rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
            <form>
                <h1 className="text-white">
                    Wrong token
                </h1>
                <br />

                <div className="relative mb-6" data-te-input-wrapper-init>
                    <input
                        type="text"
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" id="token"
                        placeholder="token"
                        name="token"
                    />
                    <label
                        htmlFor="token"
                        className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">
                    </label>
                </div>





                <button
                    id="button-center"
                    type="submit"
                    className="centered text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    data-te-ripple-init
                    data-te-ripple-color="light">
                    log in
                </button>
            </form>
        </div>
    </div>
}
export function search(token: string) {


    return <div id="search">

            <form id="search-form" action={"/?token=" + token}>
                <label htmlFor="default-search"
                    className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">

                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" id="default-search"
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search for name, company, number or MBTI"
                        name="search"
                        required
                    />
                    <input className="hidden" type="text" name="token" defaultValue={token} />
                    <button type="submit"
                        className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                </div>
            </form>

        </div>
    
}
function row(v: archiveProfile, index: number) {
    return <div>
        <Fragment key={index}>

            <tr >

                <td
                    className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                    <div>{v.whatsappid}</div>
                    </td>
                <td
                    className="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                    {v.name}
                    </td>
                <td
                    className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
                    {v.company}
                    </td>

                <td
                    className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
                    {v.mbti}
                    </td>

            </tr>
        </Fragment>
        </div>
    
}
export async function table(query: string) {
    const rows = (await GetArchives(query)).map(row)
    if (rows.length == 0&& query!=="") {
        return <div id="nothing-found">
            <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
                <p className="font-bold">404 Nothing was found</p>
                <p className="text-sm">query is not stored in the databased</p>
            </div>
        </div>
    }
    if(rows.length==0){
        return <div id="nothing-found">
            <br/>
            <h1 className="text-white">
                Empty database
            </h1>
        </div>
    }
    return <div id="list">
        <div className="relative rounded-xl overflow-auto">
            <div className="shadow-sm overflow-hidden my-8">
                <table className="border-collapse table-auto w-full text-sm">
                    <thead>
                        <tr>
                            <th
                                className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
                                whatsappID</th>
                            <th
                                className="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
                                Name</th>
                            <th
                                className="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
                                Company</th>
                            <th
                                className="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
                                MBTI</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800" id="records">
                       <div> {rows}</div>

                    </tbody>
                </table>
            </div>
        </div>
    </div>
}
