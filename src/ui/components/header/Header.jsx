import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import { useRef, useState } from "react";
import { Contract, ethers } from "ethers";
import { Context } from "../../../core/context/Context.jsx";
import abi from "../../../services/abi.json";

const Header = () => {
  const [wallet, setWallet] = useState(null);
  // адрес контракта
  const contractAddress = "0x74d4c3230C61AF7565067977c99bd6367820BC35";

  // делаем хуки для записи переменных метаданных с ethers и данных с metamask
  const [readContract, setReadContract] = useState(null);
  const [writeContract, setWriteContract] = useState(null);

  // записываем того, кто ???
  const signer = useRef(null);
  const provider = useRef(null);

  // асинхронная функция авторизации через метамаск
  async function connect() {
    // определяем провайдер (метамакс)
    const newProvider = new ethers.BrowserProvider(window.ethereum);
    provider.current = newProvider;

    // определяем адрес аккаунта
    const _signer = await newProvider.getSigner();
    signer.current = _signer;
    // сохраняется кошелек
    setWallet(_signer.address);

    // объявляем контракт (деплой контракта)
    const contract = await new ethers.Contract(
      contractAddress, // адрес контракта из ремикса
      abi,
      newProvider,
    );

    // присваиваем данные из ethers и подключенного контракта
    setReadContract(contract);
    console.log(readContract);
    setWriteContract(contract.connect(_signer));
    console.log(writeContract);
  }

  // хэндлер для формы
  const handler = async (event) => {
    event.preventDefault();
    const firstToken_ = event.target[0].value; // первый FormGroup
    const secondToken_ = event.target[1].value;
    const amountOfFirstToken_ = event.target[2].value;
    const amountOfSecondToken_ = event.target[3].value;
    console.log(
      firstToken_,
      secondToken_,
      amountOfFirstToken_,
      amountOfSecondToken_,
    );
    try {
      return await writeContract.createNewPool(
        // пытаемся записать в авторизованный нами контракт
        firstToken_,
        secondToken_,
        amountOfFirstToken_,
        amountOfSecondToken_,
      );
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div
      style={{ backgroundColor: "rebeccapurple", position: "sticky" }}
      className="d-flex flex-row justify-content-evenly p-2"
    >
      <h1>ПРОФЕССИОНАЛЫ 2026</h1>
      <Button onClick={connect}>CONNECT METAMASK</Button>
      {/*<Button onClick={getAllPools}>POOOOOLS</Button>*/}
      <Form onSubmit={handler}>
        <FormGroup>
          {/* первый FormGroup*/}
          <FormLabel>Адрес 1-го токена</FormLabel>
          <FormControl placeholder={"адрес 1-го токена"}></FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>Адрес 2-го токена</FormLabel>
          <FormControl placeholder={"адрес 1-го токена"}></FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>количество 1-го токена</FormLabel>
          <FormControl
            placeholder={"количество 1-го токена"}
            type={"number"}
          ></FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>количество 2-го токена</FormLabel>
          <FormControl
            placeholder={"кол-во 2-го токена"}
            type={"number"}
          ></FormControl>
        </FormGroup>
        <Button type={"submit"} variant={"success"}>
          Создать пул
        </Button>
      </Form>
    </div>
  );
};

export { Header };
