const UserData = (req, res) => {
  const { ID, Amount, SplitInfo, Currency, CustomerEmail } = req.body;
  if (`${ID} `.trim().length < 1 || isNaN(ID)) {
    return res.status(400).json("ID invalid!(ID must be a number)");
  }
  if (Amount < 1 || isNaN(Amount)) {
    return res.status(400).json("Amount invald! (Enter a number)!");
  }
  if (SplitInfo.length < 1 || SplitInfo.length > 20) {
    return res
      .status(400)
      .json(
        "length of SplitInfo invalid! ( minimum: 1 split entity, maximum: 20 entities)!"
      );
  }
  if (`${Currency} `.trim().length < 1 || !isNaN(Currency)) {
    return res.status(400).json("Currency Description invalid!");
  }
  if (
    `${CustomerEmail} `.trim().length < 1 ||
    !`${CustomerEmail}`.includes("@")
  ) {
    return res.status(400).json("Email invalid");
  }

  let Balance = Amount;

  let orderedArray = [];

  function SortArray(SplitType) {
    for (const element of SplitInfo) {
      if (element.SplitType === SplitType) {
        orderedArray.push(element);
      }
    }
  }

  SortArray("FLAT");
  SortArray("PERCENTAGE");
  SortArray("RATIO");

  function ErrorMsg(SplitValue, SplitType) {
    if (SplitValue > Amount) {
      return res
        .status(400)
        .json(
          `split Amount value cannot be greater than the transaction Amount(${SplitType})`
        );
    }
  }

  for (const element of orderedArray) {
    if (element.SplitType === "FLAT") {
      ErrorMsg(element.SplitValue, "FLAT");
      Balance = Balance - element.SplitValue;
      element.amount = element.SplitValue;
    }
    if (element.SplitType === "PERCENTAGE") {
      let value = (element.SplitValue / 100) * Balance;
      ErrorMsg(value, "PERCENTAGE");
      Balance = Balance - value;
      element.amount = value;
    }
    if (element.SplitType === "RATIO") {
      let total = orderedArray.filter((type) => {
        return type.SplitType === "RATIO";
      });
      let totalRatio = total.reduce((prevalue, currentvalue) => {
        return prevalue + currentvalue.SplitValue;
      }, 0);

      let value = (element.SplitValue / totalRatio) * Balance;

      ErrorMsg(value, "RATIO");
      element.amount = value;
    }
  }

  let ratioDataArray = orderedArray.filter((type) => {
    return type.SplitType === "RATIO";
  });

  let finalBal = ratioDataArray.reduce((prevBal, currentAmount) => {
    return prevBal.toFixed(1) - currentAmount.amount.toFixed(1);
  }, Balance);

  if (finalBal < 0) {
    return res.status(400).json("Balance cannot be less than 0");
  }
  let resObject = {
    ID: ID,
    Balance: finalBal,
    SplitBreakdown: orderedArray.map((val) => {
      return { SplitEntityId: val.SplitEntityId, Amount: val.amount };
    }),
  };

  return res.status(200).json(resObject);
};

exports.TPSS = UserData;
