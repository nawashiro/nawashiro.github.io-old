var tweetText;

// 本を検索して結果を返す
var get_book_info = async (query) => {
  isbn = document.getElementById("isbn");

  // Google Books APIs のエンドポイント
  var endpoint = "https://www.googleapis.com/books/v1";

  // 検索API
  var bookres = await fetch(`${endpoint}/volumes?q=isbn:${isbn.value}`);
  // JSON に変換
  var bookData = await bookres.json();

  if (bookData["totalItems"] == 0) {
    alert("見つかりませんでした。");
    return 0;
  }

  console.log(bookData);

  var authors = bookData["items"]["0"]["volumeInfo"]["authors"];
  var description = bookData["items"]["0"]["volumeInfo"]["description"];
  if (
    typeof bookData["items"]["0"]["volumeInfo"]["imageLinks"] !== "undefined"
  ) {
    var imageLinks =
      bookData["items"]["0"]["volumeInfo"]["imageLinks"]["thumbnail"];
  }
  var infoLink = bookData["items"]["0"]["volumeInfo"]["infoLink"];
  var title = bookData["items"]["0"]["volumeInfo"]["title"];
  var publisher = bookData["items"]["0"]["volumeInfo"]["publisher"];

  if (typeof authors === "undefined") {
    authors = [];
  }
  var authorText = "";
  for (const author of authors) {
    authorText += ` ${author}`;
  }

  if (typeof description === "undefined") {
    description = "";
  }
  if (typeof title === "undefined") {
    title = "";
  }
  if (typeof publisher === "undefined") {
    publisher = "";
  }

  titleElement = document.getElementById("title");
  authorsElement = document.getElementById("authors");
  publisherElement = document.getElementById("publisher");
  bookPicture = document.getElementById("bookPicture");
  sourceElement = document.getElementById("source");

  titleElement.textContent = title;
  authorsElement.textContent = authorText;
  publisherElement.textContent = publisher;
  bookPicture.src = imageLinks;
  sourceElement.href = infoLink;

  //NDC推測APIのリクエスト
  var ndcQueryText = "";
  ndcQueryText += `${title}${authorText} ${publisher} ${description}`;

  if (ndcQueryText.length > 1000) {
    ndcQueryText = ndcQueryText.slice(0, 999);
  }

  var ndcQueryForm = new FormData();
  ndcQueryForm.append("bib", ndcQueryText);

  var ndcRes = await fetch("https://lab.ndl.go.jp/ndc/api/predict", {
    method: "POST",
    body: ndcQueryForm,
  });
  var ndcData = await ndcRes.json();

  var ndcNumber = ndcData[0]["value"];
  var ndcLabel = ndcData[0]["label"];

  ndcLabelText = ndcLabel.replace(/--/g, "．");
  ndcLabelText = ndcLabelText.replace(/．/g, ",");

  var ndcElement = document.getElementById("ndc");
  ndcElement.textContent = `NDC ${ndcNumber}/${ndcLabel}`;

  var encodedText = encodeURI(
    `${title}${authorText} ${publisher}\n${infoLink}`
  );

  tweetText = `https://twitter.com/intent/tweet?text=${encodedText}`;

  var hiddenContent = document.getElementById("hiddenContent");
  hiddenContent.style.visibility = "visible";
};

function tweet() {
  var ndcCheck = document.getElementById("ndcCheck");

  if (ndcCheck.checked) {
    open(`${tweetText}&hashtags=${ndcLabelText}`);
  } else {
    open(tweetText);
  }
}
