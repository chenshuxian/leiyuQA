import react, {useEffect, useState} from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

export default function LuckyList(props) {

    const hide = (cell, row, rowIndex) => {
        const head = cell.substr(0,4);
        const foot = cell.substr(-3,3);
        let res = `${head}XXX${foot}`;

        return res;
    }

    const hideName = (cell, row, rowIndex) => {
        const head = cell.substr(0,1);
        const foot = cell.substr(-1,1);
        let res = `${head}O${foot}`;

        return res;
    }

    const show = (cell, row, rowIndex) => {
        return cell;
    }

    const columns = [
        {
            dataField: 'year_prize.prize_name',
            text:'獎項',
        }, 
        {
            dataField: 'user.name',
            text: '中獎者',
            searchable: true,
            formatter: props.show ? show : hideName
        },
        {
            dataField: 'user.phone',
            text: '手機',
            formatter: props.show ? show : hide
        }
       ];

    return (
        <div className="globalContent"> 
            <div style={{zIndex:2, position:'relative'}}>
                <h3>中獎清單</h3>
                <BootstrapTable keyField='id' data={ props.luckys } columns={ columns } 
                pagination={ paginationFactory({showTotal:true}) }/>
            </div>
        </div>
    )
}
