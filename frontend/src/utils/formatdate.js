export function formatdate(date)
{
    let formatedDate = new Date(date).toLocaleDateString()

    return formatedDate;
}