import sys
import json
import qrcode
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib import colors
from datetime import datetime
import os
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def generate_ticket_pdf():
    try:
        # Get ticket data from command line argument
        ticket_data = json.loads(sys.argv[1])
        logger.info(f"Generating ticket for ID: {ticket_data['id']}")
        
        # Create QR code with error handling
        try:
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_H,
                box_size=10,
                border=4,
            )
            qr_data = json.dumps({
                "ticket_id": ticket_data["id"],
                "email": ticket_data["email"]
            })
            qr.add_data(qr_data)
            qr.make(fit=True)
            qr_image = qr.make_image(fill_color="black", back_color="white")
            
            # Save QR code temporarily with absolute path
            temp_dir = os.path.dirname(os.path.abspath(__file__))
            temp_qr_path = os.path.join(temp_dir, f"temp_qr_{ticket_data['id']}.png")
            qr_image.save(temp_qr_path)
            logger.info(f"QR code saved to: {temp_qr_path}")
        except Exception as e:
            logger.error(f"QR generation error: {str(e)}")
            raise
        
        # Create PDF with error handling
        try:
            pdf_path = os.path.join(temp_dir, f"ticket_{ticket_data['id']}.pdf")
            c = canvas.Canvas(pdf_path, pagesize=A4)
            
            # Set background
            c.setFillColorRGB(0.95, 0.95, 0.95)
            c.rect(0, 0, A4[0], A4[1], fill=True)
            
            # Add header
            c.setFillColorRGB(0.2, 0.3, 0.8)
            c.rect(0, A4[1]-2*inch, A4[0], 2*inch, fill=True)
            c.rect(0, 0, A4[0], 2*inch, fill=True)
            
            # Add content
            c.setFillColorRGB(1, 1, 1)
            c.setFont("Helvetica-Bold", 32)
            c.drawString(1*inch, 10.5*inch, "BIG BULL EVENTS")
            
            # Add ticket details
            c.setFillColorRGB(0.2, 0.2, 0.2)
            c.setFont("Helvetica-Bold", 24)
            c.drawString(1*inch, 9*inch, ticket_data["eventName"])
            
            # Add event details
            formatted_date = datetime.fromisoformat(ticket_data["purchaseDate"].replace('Z', '+00:00')).strftime("%B %d, %Y at %I:%M %p")
            
            # Add QR code
            if os.path.exists(temp_qr_path):
                c.drawImage(temp_qr_path, A4[0]-3*inch, 7*inch, width=2*inch, height=2*inch)
            
            # Add details
            c.setFont("Helvetica", 12)
            details = [
                ("TICKET ID", ticket_data["id"]),
                ("DATE PURCHASED", formatted_date),
                ("EMAIL", ticket_data["email"]),
                ("PRICE", f"LKR {ticket_data['price']:.2f}")
            ]
            
            y_position = 8*inch
            for label, value in details:
                c.drawString(1*inch, y_position, f"{label}: {value}")
                y_position -= 0.5*inch
            
            c.save()
            logger.info(f"PDF saved to: {pdf_path}")
            
            # Clean up QR code
            if os.path.exists(temp_qr_path):
                os.remove(temp_qr_path)
                logger.info("Temporary QR code file cleaned up")
            
            print(pdf_path)
            return pdf_path
            
        except Exception as e:
            logger.error(f"PDF generation error: {str(e)}")
            raise
            
    except Exception as e:
        logger.error(f"Ticket generation failed: {str(e)}")
        raise

if __name__ == "__main__":
    try:
        generate_ticket_pdf()
    except Exception as e:
        logger.error(f"Main execution failed: {str(e)}")
        sys.exit(1)