const factor = 0.000621371192;

export default function calculatePrice(pickupLocation: {
    lift: boolean,
    floor: number,
    location: string,
    propertyType?: string
}, dropLocation: {
    lift: boolean,
    floor: number,
    location: string,
    propertyType?: string
}, vanType: string, worker: number, distance: number) : number{
    let price = 0;
    if(pickupLocation.lift){
        price += 30
    } else if(pickupLocation.floor <= 5 && pickupLocation.floor >= 0){
        price += pickupLocation.floor * 10;
    }

    if(dropLocation.lift){
        price += 30
    } else if(dropLocation.floor <= 5 && dropLocation.floor >= 0){
        price += dropLocation.floor * 10;
    }

    if(vanType === "Small"){
        price += 60
    } else if(vanType === "Medium"){
        price += 70
    } else if(vanType === "Large"){
        price += 80
    } else if(vanType === "Luton"){
        price += 90
    }
    
    if(worker == 2){
        price += 20
    } else if(worker == 3){
        price += 40
    }

    distance = distance * factor
    if(distance <= 30){
        price += distance * 2
    } else if(distance <= 60){
        price += distance * 1.5
    } else if(distance <= 90){
        price += distance * 1.3
    } else{
        price += distance
    }

    price = Math.ceil(price * 100) / 100
    return price
}