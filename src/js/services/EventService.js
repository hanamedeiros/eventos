import axios from 'axios'
import util from '../util/util'

const textConstants = {
  UNDEFINED: 'Não definido',
  FREE: 'Grátis',
}

function formatType(typeStr) {
  const type = parseInt(typeStr)
  if (isNaN(type)) {
    return 0
  }
  return type
}

function formatPrice(priceStr) {
  if (priceStr === undefined) {
    return textConstants.UNDEFINED
  }

  const priceArray = util.strSplit(priceStr)
  .map(price => parseInt(price))
  .filter(price => !isNaN(price))
  .map(price => price === 0 ? textConstants.FREE : util.currencyFormat(price))

  return util.arraySimplify(priceArray)
  .join(' - ')
}

function formatDateArray(dateStr) {
  return util.strSplit(dateStr)
  .map(util.dateFromStr)
  .filter(item => !isNaN(item.valueOf()))
}

function formatDate(dateStr) {
  return util.arraySimplify(formatDateArray(dateStr))
  .map(util.dateToStr)
  .join(' - ')
}

function formatYear(dateStr) {
  return formatDateArray(dateStr)[0].getFullYear()
}

function formatIsPast(dateStr) {
  return util.isPast(formatDateArray(dateStr)[0])
}

function formatTime(timeStr = textConstants.UNDEFINED) {
  return timeStr
}

function formatLocation(locationStr = textConstants.UNDEFINED) {
  return locationStr
}

function formatAddress(addressStr = textConstants.UNDEFINED) {
  return addressStr
}

function formatTagsArray(tagsStr = '') {
  return tagsStr.length ? util.strSplit(tagsStr) : []
}

function prepareEventData(event) {
  event.formattedType = formatType(event.type)
  event.formattedPrice = formatPrice(event.price)
  event.formattedDate = formatDate(event.date)
  event.formattedDateArray = formatDateArray(event.date)
  event.formattedYear = formatYear(event.date)
  event.formattedIsPast = formatIsPast(event.date)
  event.formattedTime = formatTime(event.time)
  event.formattedLocation = formatLocation(event.location)
  event.formattedAddress = formatAddress(event.address)
  event.formattedTagArray = formatTagsArray(event.tags)
  return event
}

function sortEvents(e1, e2) {
  const now = new Date()
  const d1 = e1.formattedDateArray.slice().pop().valueOf()
  const d2 = e2.formattedDateArray.slice().pop().valueOf()
  if (d1 < now) {
    return d2 < now && d1 > d2 ? -1 : 1
  }
  return d1 < d2 || d2 < now ? -1 : 1
}

export function getEvents() {
  return axios.get('./data/events.json')
  .then(({ data }) => {
    return data
    .map((event, index) => {
      event.id = index
      return prepareEventData(event)
    })
    .sort(sortEvents)
  })
}
