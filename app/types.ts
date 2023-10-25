export const limitConversation = 10

export type messageApi={
    message:string
    response:string
}

export type flowiseApi={
    question:string
    history:messagesFlowise[]
    overrideConfig:{
        returnSourceDocuments:boolean
    }
}
export type messagesFlowise={
    type :string
    message:string
}
export type archiveProfile={
    WhatsappID:string
    Name:string
    Company:string
    MBTI:string
    
}
export type Params={
    params:{}
    searchParams:{ [key: string]: string |  undefined };

}