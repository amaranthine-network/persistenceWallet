import {Form, Modal} from 'react-bootstrap';
import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import VisibilityIcon from '@material-ui/icons/Visibility';
import {connect} from "react-redux";

const ModalViewAmountDetails = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    };
    const handleModal = () => {
        setShow(true);
    };

    return (
        <>
            <Modal
                animation={false}
                centered={true}
                show={show}
                backdrop="static"
                size="lg"
                className="modal-custom faq-modal"
                onHide={handleClose}>
                <Modal.Header className="result-header" closeButton>
                    Tokens received via IBC
                </Modal.Header>
                <Modal.Body className="faq-modal-body">
                    <ul className="modal-list-data">
                        {props.list ?
                            props.list.map((item, index) => {
                                if (item.denom !== 'uxprt') {
                                    return (
                                        <li className="" key={index}><span
                                            className="amount">{item.amount / 1000000}</span> <span
                                            className="date">{item.denom}</span></li>
                                    )
                                }
                            }) : null
                        }
                    </ul>
                </Modal.Body>
            </Modal>
            <span className="view-button" onClick={handleModal}>View</span>
        </>

    );
};


const stateToProps = (state) => {
    return {
        list: state.balance.list,
    };
};


export default connect(stateToProps)(ModalViewAmountDetails);

