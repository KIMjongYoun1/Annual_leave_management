import React from 'react';

interface MailItemProps {
    mail: {
        mail_id: number;
        title: string;
        from_id: string;
        to_id:string;
        sent_at: string;
    };
    type : 'inbox' | 'sent';
    onClick: (mail_id:number) => void;
}

const MailItem = ({mail, type, onClick }:MailItemProps) => {
    return (
        <tr
        key={mail.mail_id}
        style={{borderBottom: '1px solid #ddd', cursor: 'pointer'}}
        onClick={() =>onClick(mail.mail_id)} >

        <td style={{padding: '10px'}}>{mail.title}</td>
        <td style={{padding: '10px'}}>{type === 'inbox' ? mail.from_id : mail.to_id}</td>    
        <td style={{padding: '10px'}}>{new Date(mail.sent_at).toLocaleDateString()}</td>        
        </tr>
    );
};

export default MailItem;