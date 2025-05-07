const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const Ticket = require("../models/ticket");
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Admin: Generate ticket
router.post("/generate", verifyToken, async (req, res) => {
  try {
    const { email, eventName, price } = req.body;
    
    if (!email || !eventName || !price) {
      return res.status(400).json({ message: "Email, event name and price are required" });
    }

    const ticketId = `ticket_${Date.now()}`;
    const newTicket = new Ticket({ 
      id: ticketId, 
      email,
      eventName,
      price
    });

    await newTicket.save();
    res.json({ success: true, ticket: newTicket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// List all tickets (Admin only)
router.get("/list", verifyToken, async (req, res) => {
  try {
    const { status, email } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (email) query.email = email;
    
    const tickets = await Ticket.find(query).sort({ purchaseDate: -1 });
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get ticket by ID (Admin or ticket owner)
router.get("/:ticketId", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ id: req.params.ticketId });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update ticket (Admin only)
router.put("/:ticketId", verifyToken, async (req, res) => {
  try {
    const { email, eventName, price, status } = req.body;
    const ticket = await Ticket.findOne({ id: req.params.ticketId });
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    if (email) ticket.email = email;
    if (eventName) ticket.eventName = eventName;
    if (price) ticket.price = price;
    if (status) ticket.status = status;

    await ticket.save();
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete ticket (Admin only)
router.delete("/:ticketId", verifyToken, async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndDelete({ id: req.params.ticketId });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }
    res.json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Validate ticket
router.post("/validate", async (req, res) => {
  try {
    const { ticketId, email } = req.body;
    const ticket = await Ticket.findOne({ id: ticketId, email });

    if (!ticket) {
      return res.json({ success: false, message: "Ticket not found" });
    }

    if (ticket.status !== 'active') {
      return res.json({ success: false, message: `Ticket is ${ticket.status}` });
    }

    ticket.status = 'used';
    ticket.used = true;
    await ticket.save();

    res.json({ success: true, message: "Ticket validated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Generate ticket PDF
router.get("/:ticketId/pdf", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ id: req.params.ticketId });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    // Call Python script with proper error handling
    const pythonProcess = spawn('python', [
      path.join(__dirname, '../utils/ticket_generator.py'),
      JSON.stringify(ticket)
    ]);

    let pdfPath = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      pdfPath = data.toString().trim();
      console.log('Python script output:', pdfPath);
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error('Python script error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script failed with code:', code);
        console.error('Error output:', errorOutput);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to generate PDF",
          error: errorOutput
        });
      }

      if (!pdfPath || !fs.existsSync(pdfPath)) {
        return res.status(500).json({ 
          success: false, 
          message: "PDF file not found",
          path: pdfPath
        });
      }

      res.download(pdfPath, `ticket_${ticket.id}.pdf`, (err) => {
        if (err) {
          console.error('Download error:', err);
          return res.status(500).json({ 
            success: false, 
            message: "Download failed",
            error: err.message
          });
        }
        // Clean up PDF file after download
        fs.unlink(pdfPath, (unlinkErr) => {
          if (unlinkErr) console.error('File cleanup error:', unlinkErr);
        });
      });
    });
  } catch (error) {
    console.error('Ticket PDF generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;