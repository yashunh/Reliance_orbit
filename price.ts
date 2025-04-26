const factor = 0.000621371192;

export default function calculatePrice(
    pickupLocation: { lift: boolean; floor: number; location: string; propertyType?: string },
    dropLocation: { lift: boolean; floor: number; location: string; propertyType?: string },
    vanType: string,
    worker: number,
    distance: number,
    itemsToAssemble: number = 0,
    itemsToDismantle: number = 0
): number {
    let price = 0;

    price += pickupLocation.lift ? 30 : pickupLocation.floor >= 5 ? pickupLocation.floor * 10 : 0;
    price += dropLocation.lift ? 30 : dropLocation.floor >= 5 ? dropLocation.floor * 10 : 0;

    const vanPrices: Record<string, number> = { Small: 60, Medium: 70, Large: 80, Luton: 90 };
    price += vanPrices[vanType] ?? 0;

    if (worker === 2) price += 20;
    if (worker === 3) price += 40;

    price += itemsToDismantle * 20;
    price += itemsToAssemble * 30;

    distance *= factor;
    if (distance <= 30) price += distance * 2;
    else if (distance <= 60) price += distance * 1.5;
    else if (distance <= 90) price += distance * 1.3;
    else price += distance;

    return Math.ceil(price * 100) / 100;
}
