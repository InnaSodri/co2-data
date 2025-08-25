const fs=require('fs')

const baseCountries=[{"name":"Afghanistan","iso":"AFG","region":"Asia"},{"name":"Albania","iso":"ALB","region":"Europe"},{"name":"Algeria","iso":"DZA","region":"Africa"},{"name":"Andorra","iso":"AND","region":"Europe"},{"name":"Angola","iso":"AGO","region":"Africa"},{"name":"Argentina","iso":"ARG","region":"South America"},{"name":"Armenia","iso":"ARM","region":"Asia"},{"name":"Australia","iso":"AUS","region":"Oceania"},{"name":"Austria","iso":"AUT","region":"Europe"},{"name":"Azerbaijan","iso":"AZE","region":"Asia"},{"name":"Bangladesh","iso":"BGD","region":"Asia"},{"name":"Belarus","iso":"BLR","region":"Europe"},{"name":"Belgium","iso":"BEL","region":"Europe"},{"name":"Benin","iso":"BEN","region":"Africa"},{"name":"Bolivia","iso":"BOL","region":"South America"},{"name":"Bosnia and Herzegovina","iso":"BIH","region":"Europe"},{"name":"Botswana","iso":"BWA","region":"Africa"},{"name":"Brazil","iso":"BRA","region":"South America"},{"name":"Bulgaria","iso":"BGR","region":"Europe"},{"name":"Cambodia","iso":"KHM","region":"Asia"},{"name":"Cameroon","iso":"CMR","region":"Africa"},{"name":"Canada","iso":"CAN","region":"North America"},{"name":"Chile","iso":"CHL","region":"South America"},{"name":"China","iso":"CHN","region":"Asia"},{"name":"Colombia","iso":"COL","region":"South America"},{"name":"Costa Rica","iso":"CRI","region":"North America"},{"name":"Croatia","iso":"HRV","region":"Europe"},{"name":"Cuba","iso":"CUB","region":"North America"},{"name":"Cyprus","iso":"CYP","region":"Asia"},{"name":"Czechia","iso":"CZE","region":"Europe"},{"name":"Denmark","iso":"DNK","region":"Europe"},{"name":"Dominican Republic","iso":"DOM","region":"North America"},{"name":"Egypt","iso":"EGY","region":"Africa"},{"name":"Ethiopia","iso":"ETH","region":"Africa"},{"name":"Finland","iso":"FIN","region":"Europe"},{"name":"France","iso":"FRA","region":"Europe"},{"name":"Germany","iso":"DEU","region":"Europe"},{"name":"Ghana","iso":"GHA","region":"Africa"},{"name":"Greece","iso":"GRC","region":"Europe"},{"name":"Hungary","iso":"HUN","region":"Europe"},{"name":"India","iso":"IND","region":"Asia"},{"name":"Indonesia","iso":"IDN","region":"Asia"},{"name":"Iran","iso":"IRN","region":"Asia"},{"name":"Iraq","iso":"IRQ","region":"Asia"},{"name":"Ireland","iso":"IRL","region":"Europe"},{"name":"Israel","iso":"ISR","region":"Asia"},{"name":"Italy","iso":"ITA","region":"Europe"},{"name":"Japan","iso":"JPN","region":"Asia"},{"name":"Jordan","iso":"JOR","region":"Asia"},{"name":"Kazakhstan","iso":"KAZ","region":"Asia"},{"name":"Kenya","iso":"KEN","region":"Africa"},{"name":"Kuwait","iso":"KWT","region":"Asia"},{"name":"Latvia","iso":"LVA","region":"Europe"},{"name":"Lebanon","iso":"LBN","region":"Asia"},{"name":"Libya","iso":"LBY","region":"Africa"},{"name":"Lithuania","iso":"LTU","region":"Europe"},{"name":"Luxembourg","iso":"LUX","region":"Europe"},{"name":"Malaysia","iso":"MYS","region":"Asia"},{"name":"Mexico","iso":"MEX","region":"North America"},{"name":"Mongolia","iso":"MNG","region":"Asia"},{"name":"Morocco","iso":"MAR","region":"Africa"},{"name":"Netherlands","iso":"NLD","region":"Europe"},{"name":"New Zealand","iso":"NZL","region":"Oceania"},{"name":"Nigeria","iso":"NGA","region":"Africa"},{"name":"Norway","iso":"NOR","region":"Europe"},{"name":"Pakistan","iso":"PAK","region":"Asia"},{"name":"Peru","iso":"PER","region":"South America"},{"name":"Philippines","iso":"PHL","region":"Asia"},{"name":"Poland","iso":"POL","region":"Europe"},{"name":"Portugal","iso":"PRT","region":"Europe"},{"name":"Qatar","iso":"QAT","region":"Asia"},{"name":"Romania","iso":"ROU","region":"Europe"},{"name":"Russia","iso":"RUS","region":"Europe"},{"name":"Saudi Arabia","iso":"SAU","region":"Asia"},{"name":"Serbia","iso":"SRB","region":"Europe"},{"name":"Singapore","iso":"SGP","region":"Asia"},{"name":"Slovakia","iso":"SVK","region":"Europe"},{"name":"South Africa","iso":"ZAF","region":"Africa"},{"name":"South Korea","iso":"KOR","region":"Asia"},{"name":"Spain","iso":"ESP","region":"Europe"},{"name":"Sweden","iso":"SWE","region":"Europe"},{"name":"Switzerland","iso":"CHE","region":"Europe"},{"name":"Thailand","iso":"THA","region":"Asia"},{"name":"Tunisia","iso":"TUN","region":"Africa"},{"name":"Turkey","iso":"TUR","region":"Asia"},{"name":"Ukraine","iso":"UKR","region":"Europe"},{"name":"United Arab Emirates","iso":"ARE","region":"Asia"},{"name":"United Kingdom","iso":"GBR","region":"Europe"},{"name":"United States","iso":"USA","region":"North America"},{"name":"Venezuela","iso":"VEN","region":"South America"},{"name":"Vietnam","iso":"VNM","region":"Asia"}]

const arg=(k,d)=>{const hit=process.argv.slice(2).find(s=>s.startsWith(k+'='));return hit?hit.split('=')[1]:d}
const OUT=arg('OUT','co2-data.json')
const COUNTRIES=Number(arg('COUNTRIES','6400'))
const [startYear,endYear]=arg('YEARS','1960-2024').split('-').map(Number)

let seed=1234567
const rnd=(min,max)=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;const u=((seed>>>0)%1_000_000)/1_000_000;return min+u*(max-min)}

const stream=fs.createWriteStream(OUT,{encoding:'utf8'})
stream.write('{\n')

for(let i=0;i<COUNTRIES;i++){
  const baseLen=baseCountries.length
  const b=baseCountries[i%baseLen]
  const cycle=Math.floor(i/baseLen)+1
  const name=COUNTRIES<=baseLen?b.name:`${b.name} ${cycle}`
  const iso=b.iso
  const region=b.region

  stream.write(`  ${JSON.stringify(name)}: [\n`)
  for(let y=startYear;y<=endYear;y++){
    const population=Math.floor(rnd(5e5,2.2e8))
    const co2=Number(rnd(0,600).toFixed(2))
    const co2_per_capita=Number((co2/Math.max(population,1)*1e6).toFixed(2))
    const row={
      year:y,population,co2,co2_per_capita,iso_code:iso,region,
      methane:Number(rnd(0,60).toFixed(2)),
      oil_co2:Number(rnd(0,250).toFixed(2)),
      gas_co2:Number(rnd(0,250).toFixed(2)),
      coal_co2:Number(rnd(0,250).toFixed(2)),
      cement_co2:Number(rnd(0,6).toFixed(2)),
      flaring_co2:Number(rnd(0,6).toFixed(2)),
      temperature_change_from_co2:Number(rnd(-0.25,0.65).toFixed(2))
    }
    if(i%7===0&&y%5===0) delete row.population
    if(i%9===0&&y%3===0) row.population=String(population)
    if(i%11===0&&y%4===0) delete row.co2_per_capita
    if(i%13===0&&y%6===0) delete row.iso_code
    if(i%5===0&&y%10===0) delete row.region

    stream.write('    '+JSON.stringify(row))
    if(y!==endYear) stream.write(',\n')
  }
  stream.write('\n  ]'+(i!==COUNTRIES-1?',\n':'\n'))
}
stream.write('}\n')
stream.end()
