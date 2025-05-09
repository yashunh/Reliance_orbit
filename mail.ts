import { transporter } from "./transporter";

export async function sendBookingMail(
    email: string,
    bookingRef: number,
    pickupLocation: { lift: boolean; floor: number; location: string; propertyType?: string },
    dropLocation: { lift: boolean; floor: number; location: string; propertyType?: string },
    distance: number,
    duration: number,
    date: string,
    worker: number,
    items: { name: string[]; quantity: number[] },
    specialRequirements?: string,
    totalPrice?: string
) {
    const pickupFloor = pickupLocation.floor === 0 ? "Ground Floor" : `${pickupLocation.floor}${getOrdinalSuffix(pickupLocation.floor)} Floor`;
    const dropFloor = dropLocation.floor === 0 ? "Ground Floor" : `${dropLocation.floor}${getOrdinalSuffix(dropLocation.floor)} Floor`;
    const serviceLevel = `${worker} Person Removal Service`;

    const itemsSummary = items.name.map((itemName, index) => {
        const quantity = items.quantity[index];
        return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
        <div style="font-weight: 500; color: #374151;">${itemName}</div>
        <div style="background-color: #f3f4f6; padding: 4px 12px; border-radius: 4px; color: #4b5563; font-size: 14px;">x${quantity}</div>
      </div>
    `;
    }).join("");

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Booking Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; background-color: #f9fafb; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Booking Confirmed!</h1>
        </div>

        <div style="padding: 20px;">
          <!-- Success Message -->
          <div style="background-color: #ecfdf5; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="background-color: #10b981; color: white; border-radius: 50%; width: 64px; height: 64px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 24px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">✓</div>
            <h2 style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">Thank you for your booking</h2>
            <p style="color: #4b5563;">We have sent a confirmation email to <span style="font-weight: 500;">${email}</span></p>
          </div>

          <div style="background-color: white; border-radius: 12px; overflow: hidden; margin-bottom: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="border-bottom: 1px solid #e5e7eb; padding: 24px;">
              <h3 style="font-size: 18px; font-weight: 500; color: #374151; margin-bottom: 8px;">Your Booking Reference</h3>
              <div style="font-size: 30px; font-weight: bold; color: #2563eb; letter-spacing: 0.05em;">MOVE-${bookingRef}</div>
            </div>

            <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <!-- Pickup -->
                <div style="display: flex; align-items: flex-start; margin-bottom: 24px;">
                  <div style="flex-shrink: 0;">
                    <div style="background-color: #2563eb; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 500;">A</div>
                  </div>
                  <div style="margin-left: 16px;">
                    <div style="font-weight: 500; color: #1f2937;">${pickupLocation.location}</div>
                    <div style="font-size: 14px; color: #6b7280;">${pickupFloor}</div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; padding-left: 32px; margin-bottom: 24px;">
                  <div style="border-left: 2px dashed #d1d5db; height: 64px; margin: 0 4px;"></div>
                  <div style="margin-left: 16px; flex: 1;">
                    <div style="font-size: 14px; font-weight: 500; color: #6b7280;">Distance: <span style="color: #374151;">${distance} miles</span></div>
                    <div style="font-size: 14px; font-weight: 500; color: #6b7280;">Duration: <span style="color: #374151;">${duration} minutes</span></div>
                  </div>
                </div>

                <div style="display: flex; align-items: flex-start;">
                  <div style="flex-shrink: 0;">
                    <div style="background-color: #059669; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 500;">B</div>
                  </div>
                  <div style="margin-left: 16px;">
                    <div style="font-weight: 500; color: #1f2937;">${dropLocation.location}</div>
                    <div style="font-size: 14px; color: #6b7280;">${dropFloor}</div>
                  </div>
                </div>
              </div>

              <div style="height: 224px; background-color: #f3f4f6; border-radius: 8px; margin-bottom: 24px; display: flex; align-items: center; justify-content: center;">
                <div style="color: #6b7280; font-size: 16px; font-weight: 500;">Route Map</div>
              </div>
            </div>

            <div style="padding: 24px; border-bottom: 1px solid #e5e7eb; display: flex; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; width: 100%; margin-bottom: 16px;">
                <div style="background-color: #dbeafe; border-radius: 50%; padding: 12px; color: #2563eb; font-size: 21px;">📅</div>
                <div style="margin-left: 16px;">
                  <div style="font-size: 14px; font-weight: 500; color: #6b7280;">Moving Date</div>
                  <div style="font-weight: 500; color: #1f2937;">${date}</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; width: 100%;">
                <div style="background-color: #f3e8ff; border-radius: 50%; padding: 12px; color: #9333ea; font-size: 21px;">👥</div>
                <div style="margin-left: 16px;">
                  <div style="font-size: 14px; font-weight: 500; color: #6b7280;">Service Level</div>
                  <div style="font-weight: 500; color: #1f2937;">${serviceLevel}</div>
                </div>
              </div>
            </div>

\            <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
              <h4 style="font-weight: 500; color: #374151; margin-bottom: 16px;">Items Summary</h4>
              <div>
                ${itemsSummary}
              </div>
            </div>

            ${specialRequirements ? `
              <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
                <h4 style="font-weight: 500; color: #374151; margin-bottom: 8px;">Special Requirements</h4>
                <div style="background-color: #f9fafb; padding: 12px; border-radius: 4px; color: #4b5563; font-size: 14px;">
                  ${specialRequirements}
                </div>
              </div>
            ` : ''}

            ${totalPrice ? `
              <div style="padding:
::contentReference[oaicite:0]{index=0}
              <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
                <h4 style="font-weight: 500; color: #374151; margin-bottom: 8px;">Total Price</h4>
                <div style="background-color: #f9fafb; padding: 12px; border-radius: 4px; color: #1f2937; font-size: 16px; font-weight: bold;">
                  ${totalPrice}
                </div>
              </div>
            ` : ''}

          </div>
          <div style="text-align: center; padding: 24px; font-size: 14px; color: #6b7280;">
            If you have any questions, please contact our support team.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
    const res = await transporter.sendMail({
        from: 'yash.onlywork@gmail.com', 
        to: email,
        subject: `Your Booking Confirmation - MOVE-${bookingRef}`,
        html,
    });
    console.log(res)
}

function getOrdinalSuffix(n: number) {
    const j = n % 10,
        k = n % 100;
    if (j == 1 && k != 11) return "st";
    if (j == 2 && k != 12) return "nd";
    if (j == 3 && k != 13) return "rd";
    return "th";
}
