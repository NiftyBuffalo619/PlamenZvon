const getUrl = (city , street , road) => {
    if (road === null) { road = ""; }
    if (street === null) { street = ""; }

    const address = `${city} + ${street} + ${road}`;
    const encodedAddress = encodeURIComponent(address);
    return encodedAddress;
}

module.exports = { getUrl };