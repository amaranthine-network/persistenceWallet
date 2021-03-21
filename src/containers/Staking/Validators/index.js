import React, {useEffect, useState} from "react";
import {Table, Modal, Dropdown} from "react-bootstrap";
import ModalDelegate from "./ModalDelegate";
import IconMore from "../../../assets/images/more.svg";
import ModalReDelegate from "./ModalReDelegate";
import ModalUnbond from "./ModalUnbond";
import ModalWithdraw from "./ModalWithdraw";
import {getDelegationsUrl, getValidatorUrl} from "../../../constants/url";
import helper from "../../../utils/helper"
import axios from "axios";
import Avatar from "./Avatar";
import Loader from "../../../components/Loader";
import Lodash from 'lodash';
import {act} from "@testing-library/react";
import Icon from "../../../components/Icon";
const Validators = (props) => {
    const [modalDelegate, setModalOpen] = useState();
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState('');
    const [moniker, setMoniker] = useState('');
    const [activeValidators, setActiveValidators] = useState(0);
    const [inActiveValidators, setInActiveValidators] = useState(0);
    const [validatorsList, setValidatorsList] = useState([]);
    const handleModal = (name, address, validator) => {
        setModalOpen(name);
        setMoniker(validator);
        setAddress(address);
    };
    useEffect(() => {
        const fetchValidators = async () => {
            const address = localStorage.getItem('address');
            console.log(address, "loggedIn address")
            const delegationsUrl = getDelegationsUrl(address);
            const delegationResponse = await axios.get(delegationsUrl);
            let delegationResponseList = delegationResponse.data.delegation_responses;
            let validators = [];
            for (const item of delegationResponseList) {
                const validatorUrl = getValidatorUrl(item.delegation.validator_address);
                const validatorResponse = await axios.get(validatorUrl);
                validators.push(validatorResponse.data.validator);
            }
            const active = Lodash.sumBy(validators, (item) => {
                return helper.isActive(item) ? item.tokens : 0;
            });
            setActiveValidators(active);
            const inactive = Lodash.sumBy(validators, (item) => {
                return helper.isActive(item) ? 0 : item.tokens;
            });
            setInActiveValidators(inactive)
            setValidatorsList(validators);
            setLoading(false);
        };
        fetchValidators();
    }, []);
    if (loading) {
        return <Loader/>;
    }
    return (
        <div className="txns-container">
            <Table responsive borderless>
                <thead>
                <tr>
                    <th>Validator</th>
                    <th>Voting Power</th>
                    <th>Commission</th>
                    <th>Status</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {
                    validatorsList.map((validator, index) => {
                        let commissionRate = validator.commission.commission_rates.rate * 100;
                        commissionRate = parseFloat(commissionRate.toFixed(2)).toLocaleString();
                        const active = helper.isActive(validator);
                        let votingPower = validator.tokens * Math.pow(10, -6);
                        let votingPowerPercentage = active
                            ? validator.tokens * 100 / activeValidators
                            : validator.tokens * 100 / inActiveValidators;
                        votingPower = parseFloat(votingPower.toFixed(2)).toLocaleString();
                        votingPowerPercentage = parseFloat(votingPowerPercentage.toFixed(2)).toLocaleString();
                        return (
                            <tr>
                                <td className=""><Avatar
                                    identity={validator.description.identity}/> {validator.description.moniker} {active}</td>
                                <td className="">{`${votingPower} (${votingPowerPercentage}%)`}</td>
                                <td className="">{commissionRate} %</td>
                                <td className="">
                                    {active ?
                                        <span className="icon-box success" title="active">
                                        <Icon
                                            viewClass="arrow-right"
                                            icon="success"/>
                                        </span>
                                        :
                                        <span className="icon-box error" title="Inactive">
                                        <Icon
                                            viewClass="arrow-right"
                                            icon="pending"/>
                                        </span>
                                    }
                                </td>
                                <td className="actions-td">
                                    <Dropdown className="more-dropdown">
                                        <Dropdown.Toggle variant="success" className="button button-primary" id="dropdown-basic">
                                            Actions <Icon viewClass="arrow-right" icon="right-coursel"/>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            {active ?
                                                <Dropdown.Item
                                                    onClick={() => handleModal('Delegate', validator.operator_address, validator.description.moniker)}>
                                                    Delegate a Validator
                                                </Dropdown.Item>
                                                :
                                                null
                                            }
                                            <Dropdown.Item
                                                onClick={() => handleModal('Redelegate', validator.operator_address, validator.description.moniker)}>Redelegate</Dropdown.Item>
                                            <Dropdown.Item
                                                onClick={() => handleModal('Unbond', validator.operator_address, validator.description.moniker)}>Unbond</Dropdown.Item>
                                            <Dropdown.Item
                                                onClick={() => handleModal('Withdraw', validator.operator_address, validator.description.moniker)}>Claim
                                                Rewards</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>

                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
            {
                modalDelegate === 'Delegate' ?
                    <ModalDelegate setModalOpen={setModalOpen} validatorAddress={address} moniker={moniker}/>
                    : null
            }
            {
                modalDelegate === 'Redelegate' ?
                    <ModalReDelegate setModalOpen={setModalOpen} validatorAddress={address} moniker={moniker}/>
                    : null
            }
            {
                modalDelegate === 'Unbond' ?
                    <ModalUnbond setModalOpen={setModalOpen} validatorAddress={address} moniker={moniker}/>
                    : null
            }
            {
                modalDelegate === 'Withdraw' ?
                    <ModalWithdraw setModalOpen={setModalOpen} validatorAddress={address} moniker={moniker}/>
                    : null
            }
        </div>
    );
};

export default Validators;
