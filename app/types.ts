export const limitConversation = 10

export type messageApi={
    message:string
    response:string
}

export type flowiseApi={
    question:string
    information:messagesFlowise[]
    overrideConfig:{
        returnSourceDocuments:boolean
    }
}
export type messagesFlowise={
    type :string
    message:string
}
export type archiveProfile={
    whatsappid:string
    name:string
    company:string
    mbti:string
    
}
export type Params={
    params:{}
    searchParams:{ [key: string]: string |  undefined };

}