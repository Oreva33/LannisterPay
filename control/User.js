const User = (req, res) => {
  const { ID, Amount, SplitInfo,Currency,CustomerEmail} = req.body;
if (`${ID} `.trim().length < 1 || isNaN(ID) ){
  return res.status(400).json("invalid ID!(ID must be a number)")
}
if ( Amount < 1 || isNaN(Amount)){
  return res.status(400).json("invalid Amount(Enter a number)!")
}
if (SplitInfo.length < 1 || SplitInfo.length > 20){
  return res.status(400).json("invalid SplitInfo length( minimum of 1 split entity and a maximum of 20 entities)!")
}
if (`${Currency} `.trim().length < 1 || !isNaN(Currency) ){
  return res.status(400).json("Enter a valid Currency Description!")
}
if (`${CustomerEmail} `.trim().length < 1 || !`${CustomerEmail}`.includes('@')){
  return res.status(400).json("invalid email")
}


let y = SplitInfo;
let bal = Amount;

let z = [];
function d(SplitType) {
  for (const element of y) {
    if (element.SplitType === SplitType) {
      z.push(element);
    }
  }
}

d("FLAT");
d("PERCENTAGE");
d("RATIO");

  for (const element of z) {
    if (element.SplitType === "FLAT") {
      bal = bal - element.SplitValue;
      element.amount = element.SplitValue;
    }
    if (element.SplitType === "PERCENTAGE") {
      let value = (element.SplitValue / 100) * bal;
      bal = bal - value;
      element.amount = value;
    }
    if (element.SplitType === "RATIO") {
      let total = z.filter((type) => {
        return type.SplitType === "RATIO";
      });
      let totalRatio = total.reduce((prevalue, currentvalue) => {
        return prevalue + currentvalue.SplitValue;
      }, 0);

      let value = (element.SplitValue / totalRatio) * bal;
      element.amount = value;
    }
  }

  let ratiodata = z.filter((type) => {
    return type.SplitType === "RATIO";
  });

  let finalbal = ratiodata.reduce((prevbal, currentamount) => {
    return prevbal - currentamount.amount;
  }, bal);

  let ress = {
    ID: ID,
    Balance: finalbal,
    SplitBreakdown: z.map((val) => {
      return { SplitEntityId: val.SplitEntityId, Amount: val.amount };
    }),
  };

  return res.status(200).json(ress)
  
}



module.exports = {
  User: User,
};
