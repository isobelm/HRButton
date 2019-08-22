package foosballunited.hrbutton;

import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Scanner;

import foosbalunited.hrbutton.R;

public class MainActivity extends AppCompatActivity {

    public static final int TODAY = 29, DAYS_IN_MONTH = 30;
    public static final String saveFile = "data";
    public static Calendar todaysDate;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        todaysDate = new GregorianCalendar();

        try {
            Log.i("main","file searching");
            Context ctx = getApplicationContext();

            FileInputStream fileInputStream = ctx.openFileInput(saveFile);

            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            try {

                String lineData = bufferedReader.readLine();
                Scanner scanner = new Scanner(lineData);
                for (int i = 0; i < monthlyCounts.length; i++)
                {
                    monthlyCounts[i] = scanner.nextInt();
                }

                lineData = bufferedReader.readLine();
                scanner = new Scanner(lineData);
                highest = scanner.nextInt();

                lineData = bufferedReader.readLine();
                scanner = new Scanner(lineData);
                int day = scanner.nextInt();
                int year = scanner.nextInt();

                adjustForDates(todaysDate.get(Calendar.DAY_OF_YEAR), todaysDate.get(Calendar.YEAR), day, year);

                scanner.close();
                Log.i("main","file found");
            }
            catch (Exception e) {
                Log.i("main","file reading exception");
            }
        } catch (FileNotFoundException e ) {
            for (int i = 0; i < monthlyCounts.length; i++)
            {
                monthlyCounts[i] = 0;
            }
            highest = 0;
            Log.i("main","file not found");
        }

        final Button HRButton = findViewById(R.id.HRButton);
        final Button GraphButton = findViewById(R.id.GraphButton);

        final TextView dailyCountText = findViewById(R.id.dailyCount);
        dailyCountText.setText(monthlyCounts[TODAY] + "");
        dailyCountText.getPaint().setAntiAlias(false);

        final TextView highestText = findViewById(R.id.highest);
        highestText.setText(highest + "");
        highestText.getPaint().setAntiAlias(false);

        HRButton.setOnClickListener(new View.OnClickListener()
        {
            public void onClick (View v){
                Calendar tmpDate = new GregorianCalendar();
                if (tmpDate.get(Calendar.DAY_OF_YEAR) != todaysDate.get(Calendar.DAY_OF_YEAR))
                {
                    adjustForDates(tmpDate.get(Calendar.DAY_OF_YEAR), tmpDate.get(Calendar.YEAR), todaysDate.get(Calendar.DAY_OF_YEAR), todaysDate.get(Calendar.YEAR));
                    todaysDate = tmpDate;
                }
                monthlyCounts[TODAY]++;
                dailyCountText.setText(monthlyCounts[TODAY] + "");
                if (monthlyCounts[TODAY] > highest) {
                    highest = monthlyCounts[TODAY];
                    highestText.setText(highest + "");
                }
            }
        });

        GraphButton.setOnClickListener(new View.OnClickListener()
        {
            public void onClick (View v){
                Intent myIntent = new Intent(getBaseContext(),   GraphActivity.class);
                startActivity(myIntent);
            }
        });
    }

    public static int[] monthlyCounts = new int[DAYS_IN_MONTH];
    public static int highest = 0;

    private void adjustForDates(int currentDay, int currentYear, int lastDay, int lastYear)
    {
        if (currentYear != lastYear)
        {
            currentDay += (currentYear - lastYear) * 365;
        }
        int dif = currentDay - lastDay;
        for (int i = 0; i < monthlyCounts.length; i++)
        {
            if (i + dif < monthlyCounts.length)
            {
                monthlyCounts[i] = monthlyCounts[i + dif];
            }
            else {
                monthlyCounts[i] = 0;
            }
        }
    }


    @Override
    protected void onStop() {
        super.onStop();
        try {
            Log.i("main","file writing");
            Context context = getApplicationContext();
            OutputStreamWriter output = new OutputStreamWriter(context.openFileOutput(saveFile, Context.MODE_PRIVATE));

            for (int i = 0; i < monthlyCounts.length; i++)
            {
                output.write(monthlyCounts[i] + " ");

            }

            output.write("\n" + highest);

            output.write("\n" + todaysDate.get(Calendar.DAY_OF_YEAR) + " " + todaysDate.get(Calendar.YEAR));


            output.flush();
            output.close();

        } catch (Exception e) {
            Log.i("main","file not written");

        }
    }

}
