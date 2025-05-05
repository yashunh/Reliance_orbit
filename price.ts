const factor = 0.000621371192;

export default function calculatePrice(
    pickupLocation: { lift: boolean; floor: number; location: string; propertyType?: string },
    dropLocation: { lift: boolean; floor: number; location: string; propertyType?: string },
    vanType: string,
    worker: number,
    distance: number,
    itemsToAssemble: number = 0,
    itemsToDismantle: number = 0,
    stoppage: string[]
): number {
    let price = 0;

    const calculateFloorCharge = (floor: number, liftAvailable: boolean): number => {
        if (floor > 5) {
            return liftAvailable ? 0 : 30;
        } else {
            if (!liftAvailable) {
                if (floor === 1) return 10;
                else if (floor === 2) return 20;
                else if (floor === 3) return 30;
                else return 30;
            } else {
                return floor === 2 ? 20 : 0;
            }
        }
    };

    price += calculateFloorCharge(pickupLocation.floor, pickupLocation.lift);
    price += calculateFloorCharge(dropLocation.floor, dropLocation.lift);

    const vanPrices: Record<string, number> = { Small: 60, Medium: 70, Large: 80, Luton: 90 };
    price += vanPrices[vanType] ?? 0;

    if (worker === 2) price += 20;
    else if (worker === 3) price += 40;

    price += itemsToDismantle * 20;
    price += itemsToAssemble * 30;

    distance *= factor;
    if (distance <= 30) price += distance * 2;
    else if (distance <= 60) price += distance * 1.5;
    else if (distance <= 90) price += distance * 1.3;
    else price += distance;

    price += stoppage.length * 30;

    return Math.ceil(price * 100) / 100;
}
