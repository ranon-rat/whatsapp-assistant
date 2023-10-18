


async function getStuff(v) {
    const table = document.getElementById("records")
    table.innerHTML = ""
    const res = await fetch("/archive?search=" + v)
    const records = await res.json()
    records.map(v => {
        table.innerHTML += templateText(v)

    })
}
getStuff("")

document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault()
    const search = document.getElementById("default-search")
    getStuff(search.value)
    search.value = ""
})

function templateText(v) {
    return `  <tr>
    <td
        class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
        ${v.WhatsappID}</td>
    <td
        class="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
        ${v.Name}</td>
    <td
        class="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
        ${v.Company}</td>

        <td
        class="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
        ${v.MBTI}</td>

    </tr>`
}